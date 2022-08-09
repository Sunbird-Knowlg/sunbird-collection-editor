import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'lib-quality-params-modal',
  templateUrl: './quality-params-modal.component.html',
  styleUrls: ['./quality-params-modal.component.css']
})
export class QualityParamsModalComponent implements OnInit {
  @Input() qualityFormConfig:any;
  @Input() showQualityParameterPopup: boolean;
  @Output() qualityParamChanged = new EventEmitter<any>();
  @Output() requestChangesEmitter = new EventEmitter<void>();
  formData: any;
  isApprovalBtnEnable:boolean;
  totalScoreValue: number= 0;
  constructor() { }

  ngOnInit(): void {
}
  onStatusChanges(event) {
    this.isApprovalBtnEnable = event?.isValid;
  }
  valueChanges(event) {
    this.formData = event;
    console.log(event);
    this.totalScoreValue = 
    // _.sum(Object.values(this.formData));
    <number>Object.values(this.formData).filter(el=>el!=="")
    .reduce((acc:string,curr:string)=> { return parseInt(acc)+parseInt(curr) });
  }
  submitApproval(modal) {
    this.qualityParamChanged.emit(this.formData);
    modal.deny();
  }
  requestChanges(modal){
    this.requestChangesEmitter.emit();
    modal.deny();
  }
}
