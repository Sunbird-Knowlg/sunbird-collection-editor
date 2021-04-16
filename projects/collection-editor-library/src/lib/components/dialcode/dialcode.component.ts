import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { HttpClient } from '@angular/common/http';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { TreeService } from '../../services/tree/tree.service';
import { DialcodeService } from '../../services/dialcode/dialcode.service';
import { ToasterService } from '../../services/toaster/toaster.service';

@Component({
  selector: 'lib-dialcode',
  templateUrl: './dialcode.component.html',
  styleUrls: ['./dialcode.component.css']
})
export class DialcodeComponent implements OnInit {

  public qrCodeCount: { [key: string]: number; } = {
    request: 0,
    reserve: 0
  };
  public disableQRDownloadBtn = false;
  public disableQRGenerateBtn = true;
  public isGeneratingQRCodes = false;
  public showQRCodePopup = false;
  public qrCodeProcessId: string;
  public dialcodeControl: FormControl;
  public contentId: string;
  constructor(public telemetryService: EditorTelemetryService, private treeService: TreeService,
              private dialcodeService: DialcodeService, private toasterService: ToasterService,
              private httpClient: HttpClient) { }

  ngOnInit() {
    this.dialcodeControl = new FormControl('', [Validators.max(250), this.customDialcodeValidator()]);
    this.contentId = _.get(this.contentMetadata, 'identifier');
    this.treeService.treeStatus$.subscribe((status) => {
      if (status === 'loaded') {
        this.resolveQRDownloadBtn();
        this.doQRCodeCount();
      } else if ( status === 'saved') {
        this.doQRCodeCount();
        this.disableQRGenerateBtn = true;
      } else {
        this.disableQRGenerateBtn = false;
      }
    });
  }

  resolveQRDownloadBtn() {
    this.disableQRDownloadBtn = _.has(this.contentMetadata, 'qrCodeProcessId') ? true : false;
  }

  doQRCodeCount() {
    this.qrCodeCount.request = 0;
    const rootNode = this.treeService.getFirstChild();
    this.qrCodeCount.reserve = (this.contentMetadata.reservedDialcodes) ? _.size(this.contentMetadata.reservedDialcodes) : 0;
    rootNode.visit((node) => {
      if (node.data.metadata.dialcodeRequired === 'Yes') {
        this.qrCodeCount.request += 1;
      }
    });
  }

  openRequestPopup(): void {
    if (this.qrCodeCount.request > 0) {
      this.reserveDialCode(this.qrCodeCount.request + 1);
    } else {
      const requestNumber = this.qrCodeCount.reserve > 0 ? this.qrCodeCount.reserve : '';
      this.dialcodeControl.setValue(requestNumber);
      this.showQRCodePopup = true;
    }
  }

  submitDialcodeForm(): void {
    this.showQRCodePopup = false;
    this.reserveDialCode(this.dialcodeControl.value);
  }

  reserveDialCode(requestCount: number) {
    this.isGeneratingQRCodes = true;
    this.qrCodeCount.request = _.cloneDeep(requestCount);
    this.dialcodeService.reserveDialCode(this.contentId, requestCount).subscribe((res) => {
      const rootNodeMetdata = this.contentMetadata;
      rootNodeMetdata.reservedDialcodes = res.result.reservedDialcodes;
      rootNodeMetdata.qrCodeProcessId = res.result.processId;
      this.qrCodeProcessId = res.result.processId;
      this.isGeneratingQRCodes = false;
      this.doQRCodeCount();
      this.resolveQRDownloadBtn();
      this.toasterService.success('QR code generated.');
    }, (err) => {
      this.isGeneratingQRCodes = false;
      const errResponse = (err.error.result) ? err.error.result : undefined;
      if (!_.isEmpty(errResponse) && errResponse.hasOwnProperty('count')) {
        if (errResponse.count >= this.qrCodeCount.request) {
          this.toasterService.error('No new QR Codes have been generated!');
        }
      } else {
        this.toasterService.error(err.error.params.errmsg);
      }
    });
  }


  downloadQRCodes(): void {
    const meta = { medium: 'hindi', gradeLevel: ['Class 1, Class 2'], subject: 'Social Science' };
    if (meta.medium && meta.gradeLevel && meta.subject) {
      this.qrCodeProcessId = _.get(this.contentMetadata, 'qrCodeProcessId');
      this.dialcodeService.downloadQRCode(this.qrCodeProcessId).subscribe((res) =>  {
        const response = res.result;
        if (response && response.hasOwnProperty('status')) {
          if (response.status === 'in-process') {
            this.toasterService.info('QR code image generation is in progress. Please try downloading after sometime');
          } else if (response.status === 'completed') {
            const filepath = response.url;
            const pattern = new RegExp('([0-9])+(?=.[.zip])');
            const timeStamp = filepath.match(pattern);
            const categoryName = ((meta.medium + '_' + meta.gradeLevel.join('_') + '_' + meta.subject).split(' ')).join('_').toLowerCase();
            const filename = `${this.contentId}_${categoryName}_${timeStamp[0]}.zip`;
            this.downloadFile(filepath, filename);
          }
        }
      }, (err) => {
        this.toasterService.error(err.error.params.errmsg);
      });
    } else {
      this.toasterService.error('Please ensure Medium, Class and Subject value are added to the Textbook');
    }
  }

  get contentMetadata() {
    const rootNode = this.treeService.getFirstChild();
    return _.get(rootNode, 'data.metadata');
  }

  downloadFile(url: string, filename: string) {
    try {
      this.httpClient.get(url, {responseType: 'blob'})
      .subscribe(blob => {
        const objectUrl: string = URL.createObjectURL(blob);
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
        this.toasterService.success('QR codes downloaded');
      }, (error) => {
        console.error('failed to convert url to blob ' + error);
      });
    } catch (error) {
      console.error('failed to download zip file using blob url ' + error);
    }
  }

  keyPressNumbers(event: KeyboardEvent) {
    const pattern = /^([0-9])$/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  customDialcodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (control.value === null || control.value === '') { return null; }
      const inputValue: number = +control.value;
      if (this.qrCodeCount.reserve === 0 && inputValue < 2) {
        return { minErr: 'The number should be at least 2 ' };
      }
      if (this.qrCodeCount.reserve > 0 && inputValue <= this.qrCodeCount.reserve) {
        return { gteErr: `The number should be greater than ${this.qrCodeCount.reserve}` };
      }
      return null;
    };
  }
}
