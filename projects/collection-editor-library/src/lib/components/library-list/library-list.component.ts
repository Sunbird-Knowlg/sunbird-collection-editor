import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
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
})
export class LibraryListComponent implements OnInit {
@Input() contentList;
@Input() showAddedContent: any;
@Input() framework: string;
@Output() contentChangeEvent = new EventEmitter<any>();
@Output() moveEvent = new EventEmitter<any>();
@Input() selectedContent: any;
public sortContent = false;
public categoryCode: string;
  constructor(public editorService: EditorService, public telemetryService: EditorTelemetryService,
              public configService: ConfigService, private frameworkService: FrameworkService ) { }

  ngOnInit() {
    this.getFrameworkCategories();
  }

  getFrameworkCategories() {
    const frameworkId = this.framework || this.frameworkService.organisationFramework;
    if (frameworkId) {
      this.frameworkService.getFrameworkCategories(frameworkId).subscribe(frameworkRes => {
        const frameworkCategories = _.get(frameworkRes, 'result.framework.categories', []);
        if (frameworkCategories.length > 0) {
          this.categoryCode = frameworkCategories[0].code;
        }
      }, err => {
        console.error('Failed to fetch framework categories:', err);
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
