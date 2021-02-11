import { Injectable } from '@angular/core';
import 'jquery.fancytree';
import { EditorConfig } from '../../interfaces';
import { UUID } from 'angular2-uuid';
declare var $: any;
import * as _ from 'lodash-es';
import { ToasterService } from '../../services';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  public config: any;
  treeCache = {
    nodesModified: {},
    nodes: []
  };
  treeNativeElement: any;

  constructor(private toasterService: ToasterService) {}

  public initialize(editorConfig: EditorConfig) {
    this.config = editorConfig.config;
  }

  setTreeElement(el) {
    this.treeNativeElement = el;
  }

  updateNode(metadata) {
    this.setNodeTitle(metadata.name);
    this.updateTreeNodeMetadata(metadata);
  }

  updateTreeNodeMetadata(newData) {
    const activeNode = this.getActiveNode();
    const nodeId = activeNode.data.id;
    activeNode.data.metadata = {...activeNode.data.metadata, ...newData};
    activeNode.title = newData.name;
    newData = _.pickBy(newData, _.identity);
    const attributions = newData.attributions;
    if (attributions && _.isString(attributions)) {
      newData.attributions = attributions.split(',');
    }
    this.setTreeCache(nodeId, newData, activeNode.data.root);
  }

  addNode(data, createType) {
    let newNode;
    data = data || {};
    const selectedNode = this.getActiveNode();
    const node: any = {};
    // tslint:disable-next-line:max-line-length
    const nodeConfig = (createType === 'sibling') ? this.config.hierarchy[`level${selectedNode.getLevel() - 1}`] : this.config.hierarchy[`level${selectedNode.getLevel()}`];
    node.title = data.name ? (data.name) : _.get(nodeConfig, 'name');
    node.tooltip = node.tiltle;
    node.objectType = (data.visibility && data.visibility === 'Default') ? data.primaryCategory : nodeConfig.type;
    node.id = data.identifier ? data.identifier : UUID.UUID();
    node.root = false;
    node.folder = (data.visibility && data.visibility === 'Default') ? false : true;
    node.icon = (data.visibility && data.visibility === 'Default') ? 'fa fa-file-o' : _.get(nodeConfig, 'iconClass');
    node.metadata = data;
    if (node.folder) {
      newNode = (createType === 'sibling') ? selectedNode.appendSibling(node) : selectedNode.addChildren(node);
      if (_.isEmpty(newNode.data.metadata)) {
        // tslint:disable-next-line:max-line-length
        newNode.data.metadata = { mimeType: 'application/vnd.ekstep.content-collection', code: node.id, name: node.title };
      }
      // tslint:disable-next-line:max-line-length
      // const modificationData = { isNew: true, root: false, metadata: { mimeType: 'application/vnd.ekstep.content-collection', contentType: _.get(this.getActiveNode(), 'data.objectType'), code: node.id, name: node.title } };
      // tslint:disable-next-line:max-line-length
      const metadata = { mimeType: 'application/vnd.ekstep.content-collection', code: node.id, name: node.title, primaryCategory: 'Textbook Unit' };
      this.setTreeCache(node.id, metadata);
    } else {
      newNode = (createType === 'sibling') ? selectedNode.appendSibling(node) : selectedNode.addChildren(node);
    }
    newNode.setActive();
    // selectedNode.sortChildren(null, true);
    selectedNode.setExpanded();
    $('span.fancytree-title').attr('style', 'width:11em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
    $(this.treeNativeElement).scrollLeft($('.fancytree-lastsib').width());
    $(this.treeNativeElement).scrollTop($('.fancytree-lastsib').height());
  }

  removeNode() {
    const selectedNode = this.getActiveNode();
    const afterDeleteNode = selectedNode.getPrevSibling() ? selectedNode.getPrevSibling() : selectedNode.getParent();
    this.setActiveNode(afterDeleteNode);
    selectedNode.remove();
    this.clearTreeCache(selectedNode.data);
    $('span.fancytree-title').attr('style', 'width:11em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
    $(this.treeNativeElement).scrollLeft($('.fancytree-lastsib').width());
    $(this.treeNativeElement).scrollTop($('.fancytree-lastsib').height());
  }

  getTreeObject() {
    return $(this.treeNativeElement).fancytree('getTree');
  }

  getActiveNode() {
    return this.getTreeObject().getActiveNode();
  }

  setActiveNode(node) {
    node.setActive(true);
  }

  getFirstChild() {
    return $(this.treeNativeElement).fancytree('getRootNode').getFirstChild();
  }

  findNode(nodeId) {
    return this.getTreeObject().findFirst((node) => node.data.id === nodeId);
  }

  expandNode(nodeId) {
    this.findNode(nodeId).setExpanded(true);
  }

  replaceNodeId(identifiers) {
    this.getTreeObject().visit((node) => {
      if (identifiers[node.data.id]) {
        node.data.id = identifiers[node.data.id];
      }
    });
  }

  setTreeCache(nodeId, data, isRootNode?) {
    if (this.treeCache.nodesModified[nodeId]) {
      const primaryCategory = this.treeCache.nodesModified[nodeId].metadata.primaryCategory;
      // tslint:disable-next-line:max-line-length
      this.treeCache.nodesModified[nodeId].metadata = _.isEqual(primaryCategory, 'Textbook Unit') ? _.assign(this.treeCache.nodesModified[nodeId].metadata, data) : data; // TODO:: rethink this
    } else {
      // tslint:disable-next-line:max-line-length
      this.treeCache.nodesModified[nodeId] = {root: isRootNode ? true : false, metadata: {...data}, ...(nodeId.includes('do_') ? {isNew: false} : {isNew: true})};
      this.treeCache.nodes.push(nodeId); // To track sequence of modifiation
    }
  }

  clearTreeCache(node?) {
    if (node) {
      delete this.treeCache.nodesModified[node.id];
      _.remove(this.treeCache.nodes, val => val === node.id);
    } else {
      this.treeCache.nodesModified = {};
      this.treeCache.nodes = [];
    }
  }

  setNodeTitle(title) {
    if (!title) {
      title = 'Untitled';
    }
    title = this.removeSpecialChars(title);
    this.getActiveNode().applyPatch({ title }).done((a, b) => {});
    $('span.fancytree-title').attr('style', 'width:11em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
  }

  removeSpecialChars(text) {
    if (text) {
      // tslint:disable-next-line:quotemark
      const iChars = "!`~@#$^*+=[]\\\'{}|\"<>%/";
      for (let i = 0; i < text.length; i++) {
        if (iChars.indexOf(text.charAt(i)) !== -1) {
         this.toasterService.error('Special character "' + text.charAt(i) + '" is not allowed');
        }
      }
      // tslint:disable-next-line:max-line-length
      text = text.replace(/[^\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF\uFB50-\uFDFF\u0980-\u09FF\u0900-\u097F\u0D00-\u0D7F\u0A80-\u0AFF\u0C80-\u0CFF\u0B00-\u0B7F\u0A00-\u0A7F\u0B80-\u0BFF\u0C00-\u0C7F\w:&_\-.(\),\/\s]|[/]/g, '');
      return text;
    }
  }

  closePrevOpenedDropDown() {
    this.getTreeObject().visit((node) => {
      const nSpan = $(node.span);
      const dropDownElement = $(nSpan[0]).find(`#contextMenuDropDown`);
      dropDownElement.addClass('hidden');
      dropDownElement.removeClass('visible');
    });
  }

  reloadTree(nodes: any) {
    this.getTreeObject().reload(nodes);
    this.getTreeObject().getNodeByKey('_2').setActive();
  }
}
