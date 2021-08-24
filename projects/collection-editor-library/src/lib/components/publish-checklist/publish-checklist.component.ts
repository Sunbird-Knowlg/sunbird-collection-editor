import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ConfigService } from '../../services/config/config.service';
import * as _ from 'lodash-es';
@Component({
  selector: 'lib-publish-checklist',
  templateUrl: './publish-checklist.component.html',
  styleUrls: ['./publish-checklist.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PublishChecklistComponent implements OnInit {
  @Input() publishchecklist: any;
  @Input() actionType: any;
  @Output() publishEmitter = new EventEmitter<any>();
  public isButtonEnable = false;
  public fieldsAvailable: any;
  public isClosable = false;
  constructor(
    public telemetryService: EditorTelemetryService,
    public configService: ConfigService) { }

  ngOnInit(): void {
    this.isButtonEnable = _.isEmpty(this.publishchecklist) ? true : false;
  }

  handlePopUpEvents(type, modal) {
    this.isClosable = true;
    if (type === 'submit' && _.isEmpty(this.publishchecklist)) {
      this.publishEmitter.emit({ button: this.actionType });
    } else if (type === 'submit' && this.publishchecklist && !_.isEmpty(this.publishchecklist)) {
      let checkBoxData = []
      let publishData = {}
      _.forEach(_.flattenDeep(_.map(this.publishchecklist, 'fields')), field => {
        if (this.fieldsAvailable && this.fieldsAvailable[field.code] === true && field.inputType === 'checkbox') {
          checkBoxData.push(field.name);
        } else {
          publishData[field.code] = this.fieldsAvailable[field.code]; // asign value to field other than checkbox's example publishComment = 'some comment'
        }
      });
      if (checkBoxData && checkBoxData.length) {
        publishData['publishChecklist'] = checkBoxData;
      }
      this.publishEmitter.emit({ button: this.actionType, publishData: publishData});
    } else if (type === 'closeModal') {
      this.publishEmitter.emit({ button: type });
    }
    modal.deny();
  }
  outputData(eventData: any) { }

  onStatusChanges(event) {
    this.isButtonEnable = event.isValid;
  }

  valueChanges(event: any) {
    this.fieldsAvailable = event;
  }
}