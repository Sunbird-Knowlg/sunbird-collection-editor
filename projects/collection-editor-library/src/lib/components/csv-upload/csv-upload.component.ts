import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService } from '../../services/config/config.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { EditorService } from '../../services/editor/editor.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import * as _ from 'lodash-es';
@Component({
  selector: 'lib-csv-upload',
  templateUrl: './csv-upload.component.html',
  styleUrls: ['./csv-upload.component.scss']
})
export class CsvUploadComponent implements OnInit {
  @Input() collectionId;
  @Input() isCreateCsv;
  @Output() csvUploadEmitter = new EventEmitter<any>();
  public showSuccessCsv = false;
  public showCsvValidationStatus = false;
  public isUploadCsvEnable = false;
  public errorCsvStatus = false;
  public errorCsvMessage: any;
  public isClosable = true;
  public sampleCsvUrl: any;
  public updateCSVFile = false;
  public uploadCSVFile = false;
  public fileName: any;
  public file: any;
  constructor(public telemetryService: EditorTelemetryService, public configService: ConfigService,
              private toasterService: ToasterService, private editorService: EditorService, ) { }

  ngOnInit(): void {
    this.handleInputCondition();
  }
  handleInputCondition() {
    if (this.isCreateCsv) {
      this.uploadCSVFile = true;
      // tslint:disable-next-line:max-line-length
      this.sampleCsvUrl = _.get(this.editorService, 'editorConfig.config.publicStorageAccount') + _.get(this.configService.urlConFig, 'URLS.CSV.SAMPLE_COLLECTION_HIERARCHY');
    } else {
      this.updateCSVFile = true;
    }
  }
  uploadCSV(event) {
    if (event && event.target && event.target.files) {
      this.file = event.target.files[0];
      this.fileName = this.file.name;
      this.isUploadCsvEnable = true;
    } else {
      this.isUploadCsvEnable = false;
    }
  }

  updateContentWithURL(fileURL, mimeType, contentId) {
    const data = new FormData();
    data.append('fileUrl', fileURL);
    data.append('mimeType', mimeType);
    const config = {
      enctype: 'multipart/form-data',
      processData: false,
      contentType: false,
      cache: false
    };
    const option = {
      data,
      param: config
    };
    this.editorService.validateCSVFile(option, contentId).subscribe(res => {
      this.isClosable = true;
      this.showSuccessCsv = true;
      this.showCsvValidationStatus = false;
      this.csvUploadEmitter.emit({ status: true, type: 'updateHierarchy' });
    }, error => {
      this.showCsvValidationStatus = false;
      this.errorCsvStatus = true;
      this.errorCsvMessage = _.get(error, 'error.params.errmsg').split('\n');
      this.isClosable = true;
    });
  }
  closeHierarchyModal(modal) {
    this.resetConditions();
    this.uploadCSVFile = false;
    this.updateCSVFile = false;
    this.csvUploadEmitter.emit({ status: true, type: 'closeModal' });
    modal.deny();
  }
  onClickReupload() {
    if (this.isCreateCsv) {
      this.uploadCSVFile = true;
    } else {
      this.updateCSVFile = true;
    }
    this.showCsvValidationStatus = false;
    this.resetConditions();
  }
  resetConditions() {
    this.errorCsvStatus = false;
    this.errorCsvMessage = '';
    this.isUploadCsvEnable = false;
    this.file = null;
    this.fileName = '';
  }
  downloadSampleCSVFile() {
    const downloadConfig = {
      blobUrl: this.sampleCsvUrl,
      successMessage: false,
      fileType: 'csv',
      fileName: this.collectionId
    };
    window.open(downloadConfig.blobUrl, '_blank');
    /*this.editorService.downloadBlobUrlFile(downloadConfig);*/
  }
  uploadToBlob(signedURL, file, config): Observable<any> {
    return this.editorService.httpClient.put(signedURL, file, config).pipe(catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.018')};
      this.isClosable = true;
      this.errorCsvStatus = true;
      this.showCsvValidationStatus = false;
      this.errorCsvMessage = _.get(err, 'error.params.errmsg') || errInfo.errorMsg;
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    }), map(data => data));
  }
  validateCSVFile() {
    this.showCsvValidationStatus = true;
    this.uploadCSVFile = false;
    this.isUploadCsvEnable = false;
    this.isClosable = false;
    this.updateCSVFile = false;
    const request = {
      content: {
        fileName: this.fileName
      }
    };
    this.editorService.generatePreSignedUrl(request, this.collectionId, 'hierarchy').pipe(catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.026') };
      this.isClosable = true;
      this.errorCsvStatus = true;
      this.showCsvValidationStatus = false;
      this.errorCsvMessage = _.get(err, 'error.params.errmsg') || errInfo.errorMsg;
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    })).subscribe((response) => {
      const signedURL = _.get(response.result, 'pre_signed_url');
      const config = {
        processData: false,
        contentType: 'text/csv',
        headers: {
          'x-ms-blob-type': 'BlockBlob'
        }
      };
      this.uploadToBlob(signedURL, this.file, config).subscribe(() => {
        const fileURL = signedURL.split('?')[0];
        this.updateContentWithURL(fileURL, this.file.type, this.collectionId);
      });
    });
  }
}
