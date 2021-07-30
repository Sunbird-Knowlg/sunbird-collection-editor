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
  @Output() publishEmitter = new EventEmitter<any>();
  public isButtonEnable = false;
  public checkBoxSelected: any;
  constructor(
    public telemetryService: EditorTelemetryService,
    public configService: ConfigService) { }

  ngOnInit(): void {
    this.publishchecklist = {
      "title": "Please confirm that ALL the following items are verified (by ticking the check-boxes) before you can publish:",
          "contents": [
              {
                  "name": "Appropriateness",
                  'renderingHints': {
                      'class': 'd-grid-inline-3 show-section-name'
                  },
                  "fields": [
                      {
                          "code": "appropriatenessOne",
                          "name": "No Hate speech, Abuse, Violence, Profanity",
                          "label": "No Hate speech, Abuse, Violence, Profanity",
                          "dataType": "boolean",
                          "inputType": "checkbox",
                          "editable": true,
                          "required": false,
                          "visible": true,
                          "validations": [
                              {
                                  "type": "required",
                                  "message": ""
                              }
                          ],
                          "renderingHints": {
                              "class": "sb-g-col-lg-1"
                          }
                      },
                      {
                          "code": "appropriatenessTwo",
                          "name": "No Sexual content, Nudity or Vulgarity",
                          "label": "No Sexual content, Nudity or Vulgarity",
                          "dataType": "boolean",
                          "inputType": "checkbox",
                          "editable": true,
                          "required": false,
                          "visible": true,
                          "validations": [
                              {
                                  "type": "required",
                                  "message": ""
                              }
                          ],
                          "renderingHints": {
                              "class": "sb-g-col-lg-1"
                          }
                      },
                      {
                          "code": "appropriatenessThree",
                          "name": "No Discrimination or Defamation",
                          "label": "No Discrimination or Defamation",
                          "dataType": "boolean",
                          "inputType": "checkbox",
                          "editable": true,
                          "required": false,
                          "visible": true,
                          "validations": [
                              {
                                  "type": "required",
                                  "message": ""
                              }
                          ],
                          "renderingHints": {
                              "class": "sb-g-col-lg-1"
                          }
                      },
                      {
                          "code": "appropriatenessFour",
                          "name": "Is suitable for children",
                          "label": "Is suitable for children",
                          "dataType": "boolean",
                          "inputType": "checkbox",
                          "editable": true,
                          "required": false,
                          "visible": true,
                          "validations": [
                              {
                                  "type": "required",
                                  "message": ""
                              }
                          ],
                          "renderingHints": {
                              "class": "sb-g-col-lg-1"
                          }
                      }
                  ]
              },
              {
                  "name": "Content details",
                  'renderingHints': {
                      'class': 'd-grid-inline-3 show-section-name'
                  },
                  "fields": [
                      {
                          "code": "contentdetailsOne",
                          "name": "Appropriate Title, Description",
                          "label": "Appropriate Title, Description",
                          "dataType": "boolean",
                          "inputType": "checkbox",
                          "editable": true,
                          "required": false,
                          "visible": true,
                          "validations": [
                              {
                                  "type": "required",
                                  "message": ""
                              }
                          ],
                          "renderingHints": {
                              "class": "sb-g-col-lg-1"
                          }
                      },
                      {
                          "code": "contentdetailsTwo",
                          "name": "Correct Board, Grade, Subject, Medium",
                          "label": "Correct Board, Grade, Subject, Medium",
                          "dataType": "boolean",
                          "inputType": "checkbox",
                          "editable": true,
                          "required": false,
                          "visible": true,
                          "validations": [
                              {
                                  "type": "required",
                                  "message": ""
                              }
                          ],
                          "renderingHints": {
                              "class": "sb-g-col-lg-1"
                          }
                      },
                      {
                          "code": "contentdetailsThree",
                          "name": "Appropriate tags such as Resource Type, Concepts",
                          "label": "Appropriate tags such as Resource Type, Concepts",
                          "dataType": "boolean",
                          "inputType": "checkbox",
                          "editable": true,
                          "required": false,
                          "visible": true,
                          "validations": [
                              {
                                  "type": "required",
                                  "message": ""
                              }
                          ],
                          "renderingHints": {
                              "class": "sb-g-col-lg-1"
                          }
                      },
                      {
                          "code": "contentdetailsFour",
                          "name": "Relevant Keywords",
                          "label": "Relevant Keywords",
                          "dataType": "boolean",
                          "inputType": "checkbox",
                          "editable": true,
                          "required": false,
                          "visible": true,
                          "validations": [
                              {
                                  "type": "required",
                                  "message": ""
                              }
                          ],
                          "renderingHints": {
                              "class": "sb-g-col-lg-1"
                          }
                      }
                  ]
              },
              {
                  "name": "Usability",
                  'renderingHints': {
                      'class': 'd-grid-inline-3 show-section-name'
                  },
                  "fields": [
                      {
                          "code": "usabilityOne",
                          "name": "Content plays correctly",
                          "label": "Content plays correctly",
                          "dataType": "boolean",
                          "inputType": "checkbox",
                          "editable": true,
                          "required": false,
                          "visible": true,
                          "validations": [
                              {
                                  "type": "required",
                                  "message": ""
                              }
                          ],
                          "renderingHints": {
                              "class": "sb-g-col-lg-1"
                          }
                      },
                      {
                          "code": "usabilityTwo",
                          "name": "Can see the content clearly on Desktop and App",
                          "label": "Can see the content clearly on Desktop and App",
                          "dataType": "boolean",
                          "inputType": "checkbox",
                          "editable": true,
                          "required": false,
                          "visible": true,
                          "validations": [
                              {
                                  "type": "required",
                                  "message": ""
                              }
                          ],
                          "renderingHints": {
                              "class": "sb-g-col-lg-1"
                          }
                      },
                      {
                          "code": "usabilityThree",
                          "name": "Audio (if any) is clear and easy to understand",
                          "label": "Audio (if any) is clear and easy to understand",
                          "dataType": "boolean",
                          "inputType": "checkbox",
                          "editable": true,
                          "required": false,
                          "visible": true,
                          "validations": [
                              {
                                  "type": "required",
                                  "message": ""
                              }
                          ],
                          "renderingHints": {
                              "class": "sb-g-col-lg-1"
                          }
                      },
                      {
                          "code": "usabilityFour",
                          "name": "No Spelling mistakes in the text",
                          "label": "No Spelling mistakes in the text",
                          "dataType": "boolean",
                          "inputType": "checkbox",
                          "editable": true,
                          "required": false,
                          "visible": true,
                          "validations": [
                              {
                                  "type": "required",
                                  "message": ""
                              }
                          ],
                          "renderingHints": {
                              "class": "sb-g-col-lg-1"
                          }
                      },
                      {
                          "code": "usabilityFive",
                          "name": "Language is simple to understand",
                          "label": "Language is simple to understand",
                          "dataType": "boolean",
                          "inputType": "checkbox",
                          "editable": true,
                          "required": false,
                          "visible": true,
                          "validations": [
                              {
                                  "type": "required",
                                  "message": ""
                              }
                          ],
                          "renderingHints": {
                              "class": "sb-g-col-lg-1"
                          }
                      }
                  ]
              }
          ]
    }
    this.isButtonEnable = _.isEmpty(this.publishchecklist) ? true : false;

  }

  handlePopUpEvents(type, modal) {
    if (type === 'publishContent' && !this.publishchecklist) {
      this.publishEmitter.emit({ button: type, publishChecklist: [] });
    } else if (type === 'publishContent' && this.publishchecklist) {
      let publicData = []
      const fields = _.get(this.publishchecklist, 'contents');
      _.forEach(_.flattenDeep(_.map(fields, 'fields')), field => {
        if (this.checkBoxSelected && this.checkBoxSelected[field.code]) {
          publicData.push(field.name);
        }
      });
      this.publishEmitter.emit({ button: type, publishChecklist: publicData, });
    } if (type === 'closeModal') {
      this.publishEmitter.emit({ button: type });
    }
    modal.deny();
  }
  outputData(eventData: any) { }

  onStatusChanges(event) {
    this.isButtonEnable = event.isValid;
    console.log('onStatusChanges', event);
  }

  valueChanges(event: any) {
    this.checkBoxSelected = event;
    console.log('valueChanges', event);
  }
}
