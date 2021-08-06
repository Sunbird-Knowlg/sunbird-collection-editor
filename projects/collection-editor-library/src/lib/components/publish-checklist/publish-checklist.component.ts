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
  public checkBoxSelected: any;
  constructor(
    public telemetryService: EditorTelemetryService,
    public configService: ConfigService) { }

  ngOnInit(): void {
    this.isButtonEnable = _.isEmpty(this.publishchecklist) ? true : false;
  }

  handlePopUpEvents(type, modal) {
    if (type === 'submit' && _.isEmpty(this.publishchecklist)) {
      this.publishEmitter.emit({ button: this.actionType });
    } else if (type === 'submit' && this.publishchecklist && !_.isEmpty(this.publishchecklist)) {
      let checkBoxData = []
      let publishData = {}
      _.forEach(_.flattenDeep(_.map(this.publishchecklist, 'fields')), field => {
        if (this.checkBoxSelected && this.checkBoxSelected[field.code] === true) {
          checkBoxData.push(field.name);
        } else {
          publishData[field.code] = this.checkBoxSelected[field.code];
        }
      });
      publishData['publishCheckList'] = checkBoxData;
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
    this.checkBoxSelected = event;
  }
}