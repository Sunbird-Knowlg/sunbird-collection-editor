import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FineUploader } from 'fine-uploader';
import * as _ from 'lodash-es';
import { throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ToasterService } from '../../services/toaster/toaster.service';
import { EditorService } from '../../services/editor/editor.service';
import { ConfigService } from '../../services/config/config.service';
import { BulkJobService } from '../../services/bulk-job/bulk-job.service';
import { TreeService } from '../../services/tree/tree.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
declare const SunbirdFileUploadLib: any;

@Component({
  selector: 'lib-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {
  public collectionId: string;
  @ViewChild('fineUploaderUI') fineUploaderUI: ElementRef;
  @Output() bulkUploadEmitter = new EventEmitter<any>();
  public storedCollectionData;
  public process: any = {
    process_id: '',
    status: '',
    type: 'bulk_upload',
    overall_stats: {
      total: 0,
      upload_failed: 0,
      upload_pending: 0,
      upload_success: 0
    }
  };
  public oldProcessStatus = '';
  public stageStatus = '';
  public contents: Array<any> = [];
  public completionPercentage = 0;
  public showBulkUploadModal = false;
  public bulkUploadState = 0;
  public loading = false;
  public telemetryPageId: string;
  public assetConfig: any = {
    csv: {
      accepted: 'csv',
      size: 50
    }
  };
  uploader;
  public bulkUploadErrorMsgs = [];
  public bulkUploadValidationError = '';
  public sampleMetadataCsvUrl = '';
  constructor(
    private toasterService: ToasterService, private editorService: EditorService, public configService: ConfigService,
    private bulkJobService: BulkJobService, private treeService: TreeService, public telemetryService: EditorTelemetryService) { }

   ngOnInit() {
    this.collectionId = _.get(this.editorService.editorConfig, 'context.identifier');
    // tslint:disable-next-line:max-line-length
    this.sampleMetadataCsvUrl = _.get(this.editorService, 'editorConfig.config.publicStorageAccount') + _.get(this.configService.urlConFig, 'URLS.BULKJOB.SAMPLE_QUESTION_FILE');
    this.checkBulkUploadStatus();
    this.stageStatus = this.getContentStatus();
  }

  calculateCompletionPercentage() {
    this.completionPercentage = 0;
    console.log('process.overall_stats', this.process.overall_stats);
    const { total, upload_pending } = this.process.overall_stats;

    // tslint:disable-next-line:radix
    this.completionPercentage = parseInt(_.toNumber(100 - ((upload_pending / total) * 100)));
    console.log('completionPercentage',  this.completionPercentage);
  }

  checkBulkUploadStatus() {
    const reqData = {
      filters: {
        program_id: _.get(this.editorService.editorConfig, 'context.programId', ''),
        collection_id: this.collectionId,
        type: 'bulk_upload',
        createdby: _.get(this.editorService.editorConfig, 'context.user.id')
      },
      limit: 1
    };
    this.bulkJobService.getBulkOperationStatus(reqData)
      .subscribe((statusResponse) => {
        const count = _.get(statusResponse, 'result.count', 0);
        if (!count) {
          return;
        }

        this.process = _.first(_.get(statusResponse, 'result.process', []));
        this.oldProcessStatus = this.process.status;
        this.searchContentWithProcessId();
        this.bulkUploadState = 5;
      }, (error) => {
        console.log(error);
      });
  }

  searchContentWithProcessId() {
    this.bulkJobService.searchContentWithProcessId(this.process.process_id).subscribe((searchResponse) => {
      this.process.overall_stats.upload_failed = 0;
      this.process.overall_stats.upload_success = 0;
      this.process.overall_stats.upload_pending = 0;

      if (_.get(searchResponse, 'result.count', 0) > 0) {
        this.contents = _.compact(_.get(searchResponse.result, 'Question'));
        let status = this.stageStatus;
        if (status === 'draft') {
          status = 'Draft';
        }
        _.each(this.contents, (content) => {
          if (content.status === 'Retired') {
            this.process.overall_stats.upload_failed++;
          } else if (content.status === status) {
            this.process.overall_stats.upload_success++;
          } else {
            this.process.overall_stats.upload_pending++;
          }
        });

        this.process.overall_stats.upload_pending = this.process.overall_stats.total -
        (this.process.overall_stats.upload_success + this.process.overall_stats.upload_failed);

        if (this.process.overall_stats.upload_pending === 0) {
          this.process.status = 'completed';
        }
        this.editorService.fetchCollectionHierarchy(this.collectionId).subscribe((response) => {
          this.storedCollectionData = response.result.questionSet;
          this.calculateCompletionPercentage();
          if (this.oldProcessStatus !== this.process.status) {
            this.updateJob();
          }

        });
        if (this.process.status === 'completed') {
          this.editorService.nextBulkUploadStatus('completed');
        } else {
        this.editorService.nextBulkUploadStatus('processing');
        }
        this.bulkUploadEmitter.emit({ status: true, type: 'updateHierarchy' });
      }
    }, (error) => {
      console.log(error);
    });
  }

  downloadReport() {
    const headers = ['Name of the Question', 'Level 1 Question Set Section', 'Keywords', 'Audience',
    'Author', 'Copyright', 'License', 'Attributions', 'Identifier of the question '];
    try {
      headers.push('Status');
      headers.push('Reason for failure');

      const tableData = _.map(this.contents, (content, i) => {
        const result: any = {};
        result.name = _.get(content, 'name', '');
        result.level1 = '';
        result.keywords = _.join(_.get(content, 'keywords', []), ', ');
        result.audience = _.join(_.get(content, 'audience', []), ', ');
        result.creator = _.get(content, 'author', '');
        result.copyright = _.get(content, 'copyright', '');
        result.license = _.get(content, 'license', '');
        result.attributions = _.join(_.get(content, 'attributions', []), ', ');
        result.identifier = _.get(content, 'identifier', '');
        const selctedUnitParents: any = this.getParents(this.storedCollectionData.children, content.identifier);
        if (selctedUnitParents.found && !_.isEmpty(selctedUnitParents.parents)) {
          result.level1 = selctedUnitParents.parents;
        }

        let status = _.get(content, 'status', '');
        if ((this.stageStatus === 'draft' && status === 'Draft')) {
          status = 'Success';
        } else if (status === 'Retired') {
          status = 'Failure';
        }

        result.status = status;
        result.failedReason = _.get(content, 'questionUploadStatus', '');
        return result;
      });

      const csvDownloadConfig = {
        filename: `Bulk Upload ${this.questionSetMetadata.name.trim()}`,
        tableData,
        headers,
        showTitle: false
      };
      this.editorService.generateCSV(csvDownloadConfig);
    } catch (err) {
      console.log(err);
      this.toasterService.error(_.get(this.configService.labelConfig, 'messages.error.001'));
    }
  }

  updateJob() {
    const reqData = {
      process_id: this.process.process_id,
      overall_stats: this.process.overall_stats,
      status: this.process.status,
      updatedby: _.get(this.editorService.editorConfig, 'context.user.id')
    };
    this.bulkJobService.updateBulkJob(reqData)
      .subscribe((updateResponse) => {
        if (this.process.status === 'completed') {
          this.bulkUploadState = 6;
        } else if (this.process.status === 'processing') {
          this.bulkUploadState = 5;
        }
        this.oldProcessStatus = this.process.status;
      }, (error) => {
        console.log(error);
      });
  }

  initiateDocumentUploadModal() {
    this.loading = false;
    this.bulkUploadValidationError = '';
    this.bulkUploadErrorMsgs = [];
    return setTimeout(() => {
      this.initiateUploadModal();
    }, 0);
  }

  initiateUploadModal() {
    this.uploader = new FineUploader({
      element: document.getElementById('upload-document-div'),
      template: 'qq-template-validation',
      multiple: false,
      autoUpload: false,
      request: {
        endpoint: '/assets/uploads'
      },
      validation: {
        allowedExtensions: [this.assetConfig.csv.accepted],
        acceptFiles: ['text/csv'],
        itemLimit: 1,
        sizeLimit: _.toNumber(this.assetConfig.csv.size) * 1024 * 1024  // Convert into MB
      },
      messages: {
        sizeError: `{file} is too large, maximum file size is ${this.assetConfig.csv.size} MB.`,
        typeError: `Invalid content type (supported type: ${this.assetConfig.csv.accepted})`
      },
      callbacks: {
        onStatusChange: () => { },
        onSubmit: () => {
          this.uploadContent();
        },
        onError: () => {
          this.uploader.reset();
        }
      }
    });
    this.fineUploaderUI.nativeElement.remove();
  }

  uploadContent() {
    const file = this.uploader.getFile(0);
    const filename = this.uploader.getName(0);
    if (file == null) {
      this.toasterService.error('File is required to upload');
      this.uploader.reset();
      return;
    }
    this.bulkUploadState = 3;
    this.startBulkUpload(file, filename);
  }

  startBulkUpload(file, filename) {
    this.generatePreSignedUrl(filename).pipe(
      map(response => {
        return _.get(response.result, 'pre_signed_url');
    }), mergeMap(signedURL =>  {
      return this.uploadToBlob(signedURL, file);
    }), mergeMap(signedURL => this.createImportRequest(signedURL).pipe(
      map(importResponse => {
        this.process.process_id = _.get(importResponse, 'result.processId');
        return _.get(importResponse, 'result.count');
    }))), mergeMap(totalQuestion => this.createJobRequest(totalQuestion)
    )).subscribe((jobResponse) => {
        this.process = _.get(jobResponse, 'result');
        this.oldProcessStatus = this.process.status;
        this.calculateCompletionPercentage();
        this.editorService.nextBulkUploadStatus('processing');
        this.bulkUploadEmitter.emit({ status: true, type: 'updateHierarchy' });
        console.log('response ::', jobResponse);
    });
  }

  generatePreSignedUrl(filename) {
    const request = {
      content: {
        fileName: filename
      }
    };
    return this.editorService.generatePreSignedUrl(request, this.collectionId, 'hierarchy').pipe(catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.035') };
      this.uploader.reset();
      this.updateBulkUploadState('decrement');
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    }));
  }

  uploadToBlob(signedURL, file) {
    const csp = _.get(this.editorService.editorConfig, 'context.cloudStorage.provider', 'azure');
    const uploaderLib = new SunbirdFileUploadLib.FileUploader();
    uploaderLib.upload({ url: signedURL, file, csp })
    .on("error", (error) => {
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.036')};
      this.uploader.reset();
      this.updateBulkUploadState('decrement');
      return throwError(this.editorService.apiErrorHandling(error, errInfo));
    }).on("completed", (completed) => {
      return  signedURL.split('?')[0]
    })
  }

  createImportRequest(fileUrl) {
    let reqBody = {
      fileUrl,
      questionType: 'MCQ',
      createdBy: _.get(this.editorService.editorConfig, 'context.user.id'),
      author: _.get(this.editorService.editorConfig, 'context.user.fullName', ''),
      status: 'Draft',
      questionSetId: this.collectionId
    };
    const headers = { 'X-Channel-ID': _.get(this.editorService.editorConfig, 'context.channel') };
    const derivedProperties = ['additionalCategories', 'board', 'medium', 'gradeLevel', 'subject', 'audience',
    'license', 'framework', 'topic'];
    reqBody = _.merge({}, reqBody, _.pick(this.questionSetMetadata, derivedProperties));
    return this.bulkJobService.createBulkImport(reqBody, headers).pipe(catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.001')};
      this.uploader.reset();
      if (_.get(err, 'error.result.messages')) {
        this.bulkUploadState = 4;
        this.bulkUploadErrorMsgs  = _.get(err, 'error.result.messages');
        return throwError({});
      } else {
        this.updateBulkUploadState('decrement');
        return throwError(this.editorService.apiErrorHandling(err, errInfo));
      }
    }));
  }

  get questionSetMetadata() {
    const rootNode = this.treeService.getFirstChild();
    return _.get(rootNode, 'data.metadata');
  }

  viewDetails($event) {
    $event.preventDefault();
    this.showBulkUploadModal = true;
    if (this.process.status === 'processing') {
      this.bulkUploadState = 5;
      this.checkBulkUploadStatus();
    } else {
      this.bulkUploadState = 6;
    }
  }

   getContentStatus() {
     return 'draft';
  }

  createJobRequest(rowsCount) {
    this.bulkUploadState = 5;
    const orgId =  _.get(this.editorService.editorConfig, 'context.contributionOrgId');
    const createdby = _.get(this.editorService.editorConfig, 'context.user.id');
    const programId = _.get(this.editorService.editorConfig, 'context.programId', '');
    const collectionId = this.collectionId;

    this.process.overall_stats = {
      total: rowsCount,
      upload_pending: rowsCount,
      upload_failed: 0,
      upload_success: 0
    };
    this.process.data = {
      program_id: programId,
      collection_id: collectionId
    };
    this.process.createdon = new Date();
    this.process.createdby = createdby;
    this.process.program_id = programId;
    this.process.collection_id = collectionId;
    this.process.status = 'processing';

    if (orgId) {
      this.process.data.org_id = orgId;
      this.process.org_id = orgId;
    }
    const request = { ...this.process };
    return this.bulkJobService.createBulkJob(request);
  }

  async openBulkUploadModal() {
    this.bulkUploadState = 0;
    this.showBulkUploadModal = true;
    this.updateBulkUploadState('increment');
  }

  closeBulkUploadModal() {
    this.showBulkUploadModal = false;
    this.bulkUploadState = 0;
    if (this.uploader) {
      this.uploader.reset();
    }
  }

  updateBulkUploadState(action) {
    if (this.bulkUploadState === 6 && action === 'increment') {
      return this.closeBulkUploadModal();
    }
    if (this.bulkUploadState === 4 && action === 'decrement') {
      this.bulkUploadState = 3;
    }
    this.bulkUploadState += (action === 'increment') ? 1 : -1;
    if (this.bulkUploadState === 2) {
      this.initiateDocumentUploadModal();
    }
  }

  getParentsHelper(tree: any, id: string, parents: string = '') {
    const self = this;
    if (tree.identifier === id) {
      return {
        found: true,
        parents
      };
    }
    let result = {
      found: false,
    };
    if (tree.children) {
      _.forEach(tree.children, (subtree, key) => {
        let maybeParents = parents;
        if (tree.identifier !== undefined) {
          maybeParents = tree.name;
        }
        const maybeResult: any = self.getParentsHelper(subtree, id, maybeParents);
        if (maybeResult.found) {
          result = maybeResult;
          return false;
        }
      });
    }
    return result;
  }

  getParents(data: Array<any>, id: string) {
    const tree = {
      children: data
    };
    return this.getParentsHelper(tree, id);
  }

  downloadSampleCSVFile() {
    const downloadConfig = {
      blobUrl: this.sampleMetadataCsvUrl,
      successMessage: false,
      fileType: 'csv',
      fileName: this.collectionId
    };
    window.open(downloadConfig.blobUrl, '_blank');
  }
}
