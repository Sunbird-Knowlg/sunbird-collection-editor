import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfigService} from '../../services/config/config.service';
import {EditorTelemetryService} from '../../services/telemetry/telemetry.service';
import {EditorService} from '../../services/editor/editor.service';

@Component({
    selector: 'lib-term-and-condition',
    templateUrl: './term-and-condition.component.html',
    styleUrls: ['./term-and-condition.component.scss']
})
export class TermAndConditionComponent implements OnInit {
    @Input() showEditingConsent = true;
    @Input() showSubmitConfirmPopup;
    @Output() sendForReviewOutput = new EventEmitter();
    termsConsent = false;
    editingConsent = false;

    constructor(public editorService: EditorService, public configService: ConfigService,
                public telemetryService: EditorTelemetryService) {
    }

    ngOnInit() {
    }

    get contentPolicyUrl() {
        return this.editorService.contentPolicyUrl;
    }

    checkAll($event) {
        this.termsConsent = $event.target.checked;
        this.editingConsent = $event.target.checked;
    }

    sendForReview() {
        this.sendForReviewOutput.emit({
            termsConsent: this.termsConsent,
            editingConsent: this.editingConsent,
        });
        this.resetAll();
    }

    onModalClose() {
        this.sendForReviewOutput.emit();
        this.resetAll();
    }

    resetAll() {
        this.showSubmitConfirmPopup = false;
        this.termsConsent = false;
        this.editingConsent = false;
    }
}
