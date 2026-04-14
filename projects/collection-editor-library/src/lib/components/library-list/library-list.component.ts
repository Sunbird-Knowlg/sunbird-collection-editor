import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../services/config/config.service';
import { EditorService } from '../../services/editor/editor.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { FrameworkService } from '../../services/framework/framework.service';
import * as _ from 'lodash-es';

@Component({
    selector: 'lib-library-list',
    templateUrl: './library-list.component.html',
    styleUrls: ['./library-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class LibraryListComponent implements OnInit, OnDestroy {
@Input() contentList;
@Input() showAddedContent: any;
@Output() contentChangeEvent = new EventEmitter<any>();
@Output() moveEvent = new EventEmitter<any>();
@Input() selectedContent: any;
public sortContent = false;
public categoryCode: string;
private destroy$ = new Subject<void>();
  constructor(public editorService: EditorService, public telemetryService: EditorTelemetryService,
              public configService: ConfigService, private frameworkService: FrameworkService ) { }

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

  onContentChange(selectedContent: any) {
    this.contentChangeEvent.emit({content: selectedContent});
  }

  changeFilter() {
    this.moveEvent.emit({
      action: 'showFilter'
    });
  }

  onShowAddedContentChange() {
   this.moveEvent.emit({
    action: 'showAddedContent',
    status: this.showAddedContent
  });
  }
  sortContentList() {
    this.sortContent = !this.sortContent;
    this.moveEvent.emit({
      action: 'sortContentList',
      status: this.sortContent
    });
  }
  addToLibrary() {
    if (this.editorService.checkIfContentsCanbeAdded('add')) {
      this.moveEvent.emit({
        action: 'openHierarchyPopup'
      });
    }
  }

}
