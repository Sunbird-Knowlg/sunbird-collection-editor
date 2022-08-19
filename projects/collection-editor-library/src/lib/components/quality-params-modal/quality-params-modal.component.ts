import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfigService} from '../../services/config/config.service';

@Component({
    selector: 'lib-quality-params-modal',
    templateUrl: './quality-params-modal.component.html',
    styleUrls: ['./quality-params-modal.component.css']
})
export class QualityParamsModalComponent implements OnInit {
    @Input() qualityFormConfig: any;
    @Input() showQualityParameterPopup: boolean;
    @Output() qualityParamChanged = new EventEmitter<any>();
    @Input() labelConfigData: any;
    formData: any;
    isApprovalBtnEnable: boolean;
    totalScoreValue = 0;

    constructor(public configService: ConfigService) {
    }

    ngOnInit(): void {
    }

    onStatusChanges(event) {
        this.isApprovalBtnEnable = event?.isValid;
    }

    valueChanges(event) {
        this.formData = event;
        this.totalScoreValue = 0;
        for (const key in this.formData) {
            if (this.formData[key] && !isNaN(this.formData[key])) {
                this.totalScoreValue += parseInt(this.formData[key]);
            }
        }
    }

    submitApproval() {
        this.qualityParamChanged.emit({action: 'submit', data: this.formData});
    }

    requestChanges() {
        this.qualityParamChanged.emit({action: 'requestChange'});
    }

    onModalClose() {
        this.qualityParamChanged.emit({action: 'close'});
    }
}
