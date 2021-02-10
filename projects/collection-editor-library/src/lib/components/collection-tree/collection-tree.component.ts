import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { TreeService, EditorService } from '../../services';

@Component({
  selector: 'lib-collection-tree-new',
  templateUrl: './collection-tree.component.html',
  styleUrls: ['./collection-tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CollectionTreeComponent implements OnInit {

  @Input() public nodes: any;
  public config: any;
  @Output() public treeEventEmitter: EventEmitter<any> = new EventEmitter();
  public rootNode: any;
  constructor( public treeService: TreeService,
               public editorService: EditorService) { }

  ngOnInit() {
    this.config = this.editorService.editorConfig.config;
    this.initialize();
  }

  private initialize() {
    const data = this.nodes.data;
    const treeData = this.buildTree(this.nodes.data);
    this.rootNode = [{
      id: data.identifier || UUID.UUID(),
      title: data.name,
      tooltip: data.name,
      objectType: data.primaryCategory,
      metadata: _.omit(data, ['children', 'collections']),
      folder: true,
      children: treeData,
      root: true,
      icon: _.get(this.config, 'iconClass')
    }];
  }

  buildTree(data, tree?, level?) {
    tree = tree || [];
    if (data.children) { data.children = _.sortBy(data.children, ['index']); }
    data['level'] = level ? (level + 1) : 1;
    _.forEach(data.children, (child) => {
      // const objectType = this.getObjectType(child.contentType);
      console.log(data.level, child.name, _.get(this.config, `hierarchy.level${data.level}.iconClass`), '-------->NNNNNN');
      const childTree = [];
      // if (objectType) {
      tree.push({
        id: child.identifier || UUID.UUID(),
        title: child.name,
        tooltip: child.name,
        objectType: child.visibility === 'Parent' ? _.get(this.config, `hierarchy.level${data.level}.type`) : 'Content',
        metadata: _.omit(child, ['children', 'collections']),
        folder: child.visibility === 'Parent' ? true : false,
        children: childTree,
        root: false,
        // tslint:disable-next-line:max-line-length
        icon: child.visibility === 'Parent' ? (_.get(this.config, `hierarchy.level.${data.level}.iconClass`) || 'fa fa-folder-o') : 'fa fa-file-o'
      });
      if (child.visibility === 'Parent') {
        this.buildTree(child, childTree, data.level);
      }
      // }
    });
    return tree;
  }


  public treeEventListener(event: any) {
    switch (event.type) {
      case 'nodeSelect':
        this.treeEventEmitter.emit({ 'type': 'nodeSelect', 'data': event.data });
        break;
      case 'addChild':
        this.treeEventEmitter.emit({ 'type': 'addChild', 'data': event.data });
        break;
      case 'addSibling':
        this.treeEventEmitter.emit({ 'type': 'addChild', 'data': event.data });
        break;
      default:
        break;
    }
  }

}
