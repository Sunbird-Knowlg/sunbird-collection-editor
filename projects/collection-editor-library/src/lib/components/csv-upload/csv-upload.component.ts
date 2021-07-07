import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService } from '../../services/config/config.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { EditorService } from '../../services/editor/editor.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError, forkJoin } from 'rxjs';
import * as _ from 'lodash-es';
@Component({
  selector: 'lib-csv-upload',
  templateUrl: './csv-upload.component.html',
  styleUrls: ['./csv-upload.component.css']
})
export class CsvUploadComponent implements OnInit {
  @Input() collectionId;
  @Input() isCreateCsv;
  @Output() csvUploadEmitter = new EventEmitter<any>();
  public showSuccessCSV = false;
  public showCsvValidationStatus = false;
  public isUploadCSV = false;
  public errorCsvStatus = false;
  public errorCsvMessage: any;
  public isClosable = true;
  public sampleCsvUrl: any; // need add sample file url
  public updateCSVFile = false;
  public uploadCSVFile = false;
  public fileName: any;
  public file: any;
  constructor(public telemetryService: EditorTelemetryService, public configService: ConfigService,
              private toasterService: ToasterService, private editorService: EditorService,) { }

  ngOnInit(): void {
    this.handleInputCondition();
  }
  handleInputCondition() {
    if (this.isCreateCsv) {
      this.uploadCSVFile = true;
    } else {
      this.updateCSVFile = true;
    }
  }
  uploadCSV(event) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    this.isUploadCSV = true;
  }
  validateCSVFile() {
    this.showCsvValidationStatus = true;
    this.uploadCSVFile = false;
    this.isUploadCSV = false;
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
      this.errorCsvMessage = _.get(err, 'error.params.errmsg');
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    })).subscribe((response) => {
      const signedURL = response.result.pre_signed_url;
      const config = {
        processData: false,
        contentType: 'text/csv',
        headers: {
          'x-ms-blob-type': 'BlockBlob'
        }
      };
      this.uploadToBlob(signedURL, this.file, config).subscribe(() => {
        const fileURL = signedURL.split('?')[0];
        this.updateContentWithURL(fileURL, this.collectionId);
      });
    });
  }

  uploadToBlob(signedURL, file, config): Observable<any> {
    return this.editorService.httpClient.put(signedURL, file, config).pipe(catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.018') };
      this.isClosable = true;
      this.errorCsvStatus = true;
      this.showCsvValidationStatus = false;
      this.errorCsvMessage = _.get(err, 'error.params.errmsg');
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    }), map(data => data));
  }
  updateContentWithURL(fileURL, contentId) {
    this.editorService.validateCSVFile(fileURL, contentId).subscribe(res => {
      this.showCsvValidationStatus = false;
      this.isClosable = true;
      this.showSuccessCSV = true;
      this.csvUploadEmitter.emit({status: true, type: 'updateHierarchy'});
    }, error => {
      this.showCsvValidationStatus = false;
      this.errorCsvStatus = true;
      this.errorCsvMessage = _.get(error, 'error.params.errmsg');
      this.isClosable = true;
    });
  }
  closeHierarchyModal(modal) {
    this.resetConditionns();
    this.uploadCSVFile = false;
    this.updateCSVFile = false;
    this.csvUploadEmitter.emit({status: true, type: 'closeModal'});
    modal.deny();
  }
  onClickReupload() {
    if (this.isCreateCsv) {
      this.uploadCSVFile = true;
    } else {
      this.updateCSVFile = true;
    }
    this.showCsvValidationStatus = false;
    this.resetConditionns();
  }
  resetConditionns() {
    this.errorCsvStatus = false;
    this.errorCsvMessage = '';
    this.isUploadCSV = false;
    this.file = null;
  }
  downloadSampleCSVFile() {
    const downloadConfig = {
      blobUrl: '', // need to update here for sample file url
      successMessage: _.get(this.configService, 'labelConfig.messages.success.013'),
      fileType: 'csv',
      fileName: this.collectionId
    };
    this.editorService.downloadBlobUrlFile(downloadConfig);
  }
}
