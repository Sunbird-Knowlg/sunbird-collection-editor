import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as _ from 'lodash-es';
import { EditorService } from '../../services/editor/editor.service';
import { ConfigService } from '../../services/config/config.service';
import { TreeService } from '../../services/tree/tree.service';

@Component({
    selector: 'lib-relational-metadata',
    templateUrl: './relational-metadata.component.html',
    styleUrls: ['./relational-metadata.component.css'],
    standalone: false
})
export class RelationalMetadataComponent implements OnInit, OnChanges {

  @Input() contentMetadata: any;
  @Input() formConfig: any;
  public contentId;
  @Output() statusChanges = new EventEmitter<any>();
  @Output() valueChanges = new EventEmitter<any>();
  public formFieldProperties: any;
  constructor(private editorService: EditorService, private treeService: TreeService) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.contentMetadata = _.get(this.contentMetadata, 'data.metadata') || this.contentMetadata;
    if (this.contentId !== this.contentMetadata.identifier) {
      this.contentId = this.contentMetadata.identifier;
      this.attachDefaultValues();
    }
  }

  attachDefaultValues() {
    let formConfig = _.cloneDeep(this.formConfig);
    formConfig = this.formConfig && _.has(_.first(formConfig), 'fields') ? formConfig : [{name: '', fields: formConfig}];
    const metaDataFields = _.get(this.contentMetadata, 'relationalMetadata', {});
    _.forEach(formConfig, (section) => {
      _.forEach(section.fields, field => {
        if (metaDataFields) {
          if (_.has(metaDataFields, field.code)) {
            field.default = _.get(metaDataFields, field.code);
          }
        }
        const ifEditable = this.ifFieldIsEditable(field.code);
        _.set(field, 'editable', ifEditable);

      });
    });
    this.formFieldProperties = _.cloneDeep(formConfig);
  }

  isReviewMode() {
    return  _.includes([ 'review', 'read', 'sourcingreview', 'orgreview' ], this.editorService.editorMode);
  }

  ifFieldIsEditable(fieldCode) {
    const ediorMode = this.editorService.editorMode;
    if (!this.isReviewMode()) {
      return true;
    }
    const editableFields = _.get(this.editorService.editorConfig.config, 'editableFields');
    if (editableFields && !_.isEmpty(editableFields[ediorMode]) && _.includes(editableFields[ediorMode], fieldCode)) {
      return true;
    }
    return false;
  }

  onFormStatusChange(event) {
    this.statusChanges.emit(event);
  }

  onFormValueChange(event) {
    this.valueChanges.emit(event);
    const selectedNode = this.treeService.getActiveNode();
    let relationalMetadata = _.get(selectedNode, 'data.metadata.relationalMetadata', {});
    relationalMetadata = _.assign({}, relationalMetadata, event);
    selectedNode.data.metadata = {...selectedNode.data.metadata, relationalMetadata};
  }

}
