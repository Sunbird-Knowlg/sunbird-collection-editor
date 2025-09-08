import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
export class LibraryPlayerComponent implements OnInit, OnDestroy {
@Input() contentListDetails;
@Output() moveEvent = new EventEmitter<any>();
public categoryCode: string;
private destroy$ = new Subject<void>();
  constructor(public telemetryService: EditorTelemetryService, public editorService: EditorService,
              public configService: ConfigService, private frameworkService: FrameworkService) { }

  ngOnInit() {
    this.getFrameworkCategories();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFrameworkCategories() {
    const frameworkId = this.frameworkService.organisationFramework;
    if (frameworkId) {
      this.frameworkService.getTargetFrameworkCategories([frameworkId]);
      this.frameworkService.frameworkData$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(frameworkData => {
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