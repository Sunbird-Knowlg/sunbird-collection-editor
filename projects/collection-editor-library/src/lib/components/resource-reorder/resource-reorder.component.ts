import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash-es';
import { ConfigService } from '../../services/config/config.service';
import { EditorService } from '../../services/editor/editor.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ToasterService } from '../../services/toaster/toaster.service';


@Component({
  selector: 'lib-resource-reorder',
  templateUrl: './resource-reorder.component.html',
  styleUrls: ['./resource-reorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResourceReorderComponent implements OnInit {
  unitSelected: string;
  @Input() selectedContentDetails;
  @Input() collectionId;
  @Input() collectionUnits;
  @Input() programContext;
  @Input() prevUnitSelect;
  @Input() collectionhierarcyData;
  showMoveButton = false;
  isContentAdded = false;
  @ViewChild('modal', {static: true}) modal;
  @Output() moveEvent = new EventEmitter<any>();
  collectionUnitsBreadcrumb: any = [];
  constructor(private editorService: EditorService, public configService: ConfigService,
              public telemetryService: EditorTelemetryService, private toasterService: ToasterService) {
               }

  ngOnInit() {
    this.setCollectionUnitBreadcrumb();
  }

  addResource() {
    this.editorService.addResourceToHierarchy(this.collectionId, this.prevUnitSelect, this.selectedContentDetails.identifier)
    .subscribe((data) => {
      this.modal.deny();
      this.moveEvent.emit({
        action: 'contentAdded',
        data: this.selectedContentDetails,
        prevUnitSelect: this.prevUnitSelect
      });
      this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.005'));
    }, err => {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.001'));
    });
  }

  closePopup() {
    this.moveEvent.emit({
      action: 'closeHierarchyPopup',
      contentId: '',
      collection: {
        identifier: ''
      }
    });
  }

  getParentsHelper(tree: any, id: string, parents: Array<any>) {
    const self = this;
    if (tree.identifier === id) {
      return {
        found: true,
        parents: [...parents, tree.name]
      };
    }
    let result = {
      found: false,
    };
    if (tree.children) {
      _.forEach(tree.children, (subtree, key) => {
        const maybeParents = _.concat([], parents);
        if (tree.identifier !== undefined) {
          maybeParents.push(tree.name);
        }
        const maybeResult: any = self.getParentsHelper(subtree, id, maybeParents);
        if (maybeResult.found) {
          result = maybeResult;
          return false;
        }
      });
    }
    return result;
  }

  getParents(data: Array<any>, id: string) {
    const tree = {
      children: data
    };
    return this.getParentsHelper(tree, id, []);
  }

  setCollectionUnitBreadcrumb(): void {
    if (!this.prevUnitSelect) { return; }
    const selctedUnitParents: any = this.getParents(this.collectionUnits, this.prevUnitSelect);
    if (selctedUnitParents.found) {
      this.collectionUnitsBreadcrumb = [...selctedUnitParents.parents];
    }
    this.isContentAdded = this.checkLinkingContentToCollectionChildren(_.get(this.collectionhierarcyData, 'children'));
  }
  checkLinkingContentToCollectionChildren(children) {
    const self = this;
    let isContentAdded = false;
    const selectedUnit = _.find(children, { identifier: this.prevUnitSelect });
    _.forEach(_.get(selectedUnit, 'children'), data => {
      // tslint:disable-next-line:max-line-length
      if ((data.identifier === this.selectedContentDetails.identifier) && _.includes(this.collectionhierarcyData.childNodes, this.selectedContentDetails.identifier)) {
        isContentAdded = true;
        return true;
      }
    });
    _.forEach(children, data => {
      if (data.children) {
        const res = self.checkLinkingContentToCollectionChildren(data.children);
        if (res) {
          isContentAdded = true;
          return false;
        }
      }
    });
    return isContentAdded;
  }
}
