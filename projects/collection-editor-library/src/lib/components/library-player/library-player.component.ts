import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService } from '../../services/config/config.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { EditorService } from '../../services/editor/editor.service';
import { FrameworkService } from '../../services/framework/framework.service';
import * as _ from 'lodash-es';
@Component({
  selector: 'lib-library-player',
  templateUrl: './library-player.component.html',
  styleUrls: ['./library-player.component.scss']
})
export class LibraryPlayerComponent implements OnInit {
@Input() contentListDetails;
@Output() moveEvent = new EventEmitter<any>();
public categoryCode: string;
  constructor(public telemetryService: EditorTelemetryService, public editorService: EditorService,
              public configService: ConfigService, private frameworkService: FrameworkService) { }

  ngOnInit() {
    this.getFrameworkCategories();
  }

  getFrameworkCategories() {
    const frameworkId = this.frameworkService.organisationFramework;
    if (frameworkId) {
      this.frameworkService.getTargetFrameworkCategories([frameworkId]);
      this.frameworkService.frameworkData$.subscribe(frameworkData => {
        if (frameworkData?.frameworkdata[frameworkId]) {
          const categories = frameworkData.frameworkdata[frameworkId].categories || [];
          if (categories.length) {
            this.categoryCode = categories[0].code;
          }
        }
      }, err => {
        console.error('Failed to get framework data:', err);
      });
    }
  }
  addToLibrary() {
    if (this.editorService.checkIfContentsCanbeAdded('add')) {
    this.moveEvent.emit({
      action: 'openHierarchyPopup'
    });
  }
}

}