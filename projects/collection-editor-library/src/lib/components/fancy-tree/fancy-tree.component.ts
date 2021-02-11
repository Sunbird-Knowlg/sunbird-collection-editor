import { takeUntil } from 'rxjs/operators';
import { Component, AfterViewInit, Input, ViewChild, ElementRef, Output, EventEmitter,
   OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import 'jquery.fancytree';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { EditorService, TreeService, EditorTelemetryService, HelperService, ToasterService } from '../../services';
import { Subject } from 'rxjs';
import { UUID } from 'angular2-uuid';
declare var $: any;

@Component({
  selector: 'lib-fancy-tree',
  templateUrl: './fancy-tree.component.html',
  styleUrls: ['./fancy-tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FancyTreeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('fancyTree', {static: false}) public tree: ElementRef;
  @Input() public nodes: any;
  @Input() public options: any;
  @Output() public treeEventEmitter: EventEmitter<any> = new EventEmitter();
  public config: any;
  public showTree: boolean;
  public showAddChildButton: boolean;
  public showAddSiblingButton: boolean;
  public rootNode: any;
  public rootMenuTemplate = `<span class="ui dropdown sb-dotted-dropdown" autoclose="itemClick" suidropdown="" tabindex="0">
  <span id="contextMenu" class="p-0 w-auto"><i class="icon ellipsis vertical sb-color-black"></i></span>
  <span id= "contextMenuDropDown" class="menu transition hidden" suidropdownmenu="" style="">
    <div id="addchild" class="item">Add Child</div>
  </span>
  </span>`;
  public folderMenuTemplate = `<span class="ui dropdown sb-dotted-dropdown" autoclose="itemClick" suidropdown="" tabindex="0">
  <span id="contextMenu" class="p-0 w-auto"><i class="icon ellipsis vertical sb-color-black"></i></span>
  <span id= "contextMenuDropDown" class="menu transition hidden" suidropdownmenu="" style="">
    <div id="addsibling" class="item">Add Sibling</div>
    <div id="addchild" class="item">Add Child</div>
    <div id="delete" class="item">Delete</div>
  </span>
  </span>
  <span id= "removeNodeIcon"> <i class="fa fa-trash-o" type="button"></i> </span>`;
  // tslint:disable-next-line:max-line-length
  public contentMenuTemplate = `<span id="contextMenu"><span id= "removeNodeIcon"> <i class="fa fa-trash-o" type="button"></i> </span></span>`;
  constructor(public activatedRoute: ActivatedRoute, public treeService: TreeService, private editorService: EditorService,
              public telemetryService: EditorTelemetryService, private helperService: HelperService,
              private toasterService: ToasterService) { }
  private onComponentDestroy$ = new Subject<any>();
  public showDeleteConfirmationPopUp: boolean;

  ngOnInit() {
    this.config = _.cloneDeep(this.editorService.editorConfig.config);
    if (!_.get(this.config, 'maxDepth')) {
      this.config.maxDepth = 4;
    }
    this.initialize();
  }

  ngAfterViewInit() {
    this.renderTree(this.getTreeConfig());
    this.resourceAddition();
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
    data.level = level ? (level + 1) : 1;
    _.forEach(data.children, (child) => {
      // const objectType = this.getObjectType(child.contentType);
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

  renderTree(options) {
    options = { ...options, ...this.options };
    $(this.tree.nativeElement).fancytree(options);
    this.treeService.setTreeElement(this.tree.nativeElement);
    if (this.options.showConnectors) {
      $('.fancytree-container').addClass('fancytree-connectors');
    }
    setTimeout(() => {
      this.treeService.reloadTree(this.rootNode);
    }, 0);
    setTimeout(() => {
      const rootNode = this.treeService.getFirstChild();
      if (rootNode) {
        this.treeService.setActiveNode(rootNode);
      }
      this.eachNodeActionButton(rootNode);
    });
    this.showTree = true;
  }

  resourceAddition() {
    this.editorService.resourceAddition$.pipe(takeUntil(this.onComponentDestroy$)).subscribe(resources => {
      resources.forEach(resource => {
        this.addChild(resource);
      });
    });
  }

  getTreeConfig() {
    const options: any = {
      extensions: ['glyph', 'dnd5'],
      clickFolderMode: 3,
      source: this.rootNode,
      glyph: {
        preset: 'awesome4',
        map: {
          folder: 'icon folder sb-fancyTree-icon',
          folderOpen: 'icon folder outline sb-fancyTree-icon'
        }
      },
      dnd5: {
        autoExpandMS: 400,
        // focusOnClick: true,
        preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
        preventRecursion: true, // Prevent dropping nodes on own descendants
        dragStart: (node, data) => {
          /** This function MUST be defined to enable dragging for the tree.
           *  Return false to cancel dragging of node.
           */
          const draggable = _.get(this.config, 'mode') === 'Edit' ? true : false;
          return draggable;
        },
        dragEnter: (node, data) => {
          /** data.otherNode may be null for non-fancytree droppables.
           *  Return false to disallow dropping on node. In this case
           *  dragOver and dragLeave are not called.
           *  Return 'over', 'before, or 'after' to force a hitMode.
           *  Return ['before', 'after'] to restrict available hitModes.
           *  Any other return value will calc the hitMode from the cursor position.
           */
          // Prevent dropping a parent below another parent (only sort
          // nodes under the same parent)
/*           if(node.parent !== data.otherNode.parent){
            return false;
          }
          // Don't allow dropping *over* a node (would create a child)
          return ["before", "after"];
*/
           return true;
        },
        dragDrop: (node, data) => {
          /** This function MUST be defined to enable dropping of items on
           *  the tree.
           */
          // data.otherNode.moveTo(node, data.hitMode);
          return this.dragDrop(node, data);
        },
        filter: {
          autoApply: true,
          autoExpand: false,
          counter: true,
          fuzzy: false,
          hideExpandedCounter: true,
          hideExpanders: false,
          highlight: true,
          leavesOnly: false,
          nodata: true,
          mode: 'dimm'
        }
      },
      init: (event, data) => {
        if ($(this.tree.nativeElement).fancytree('getTree').getNodeByKey('_2')) {
          $(this.tree.nativeElement).fancytree('getTree').getNodeByKey('_2').setActive();
        }
      },
      click: (event, data): boolean => {
        this.tree.nativeElement.click();
        const node = data.node;
        // this.treeEventEmitter.emit({ 'type': 'nodeSelect', 'data': node });
        this.telemetryService.interact({ edata: this.getTelemetryInteractEdata()});
        this.eachNodeActionButton(node);
        return true;
      },
      activate: (event, data) => {
        this.treeEventEmitter.emit({ type: 'nodeSelect', data: data.node });
        setTimeout(() => {
          this.attachContextMenu(data.node, true);
        }, 10);
      },
      renderNode: (event, data) => {
        // if (data.node.data.root) {
        //   // data.node.span.style.display = 'none';
        // }
        const node = data.node;
        const $nodeSpan = $(node.span);

        // check if span of node already rendered
        if (!$nodeSpan.data('rendered')) {
          this.attachContextMenu(node);

          // span rendered
          $nodeSpan.data('rendered', true);
        }
      }
    };
    return options;
  }

  expandAll(flag) {
    $(this.tree.nativeElement).fancytree('getTree').visit((node) => { node.setExpanded(flag); });
  }

  collapseAllChildrens(flag) {
    const rootNode = $(this.tree.nativeElement).fancytree('getRootNode').getFirstChild();
    _.forEach(rootNode.children, (child) => {
      child.setExpanded(flag);
    });
  }

  eachNodeActionButton(node) {
    this.showAddChildButton = ((node.getLevel() - 1) >= this.config.maxDepth) ? false : true;
    this.showAddSiblingButton = (!node.data.root) ? true : false; 
  }

  addChild(resource?) {
    const tree = $(this.tree.nativeElement).fancytree('getTree');
    const rootNode = $(this.tree.nativeElement).fancytree('getRootNode').getFirstChild();
    const nodeConfig = this.config.hierarchy[tree.getActiveNode().getLevel()];
    const childrenTypes = _.get(nodeConfig, 'children.Content');
    if ((((tree.getActiveNode().getLevel() - 1) >= this.config.maxDepth))) {
      return this.toasterService.error('Sorry, this operation is not allowed...');
    }
    if (resource) {
      if (_.includes(childrenTypes, resource.primaryCategory)) {
        this.treeService.addNode(resource, 'child');
      } else {
        this.toasterService.error('Invalida Content Type ....');
      }
    } else {
      this.treeService.addNode({}, 'child');
    }
      // this.treeEventEmitter.emit({'type': 'addChild', 'data' : (rootNode.data.root ? 'child' : 'sibling')});
  }

  addSibling() {
    const tree = $(this.tree.nativeElement).fancytree('getTree');
    const rootNode = $(this.tree.nativeElement).fancytree('getRootNode').getFirstChild();

    const node = tree.getActiveNode();
    if (!node.data.root) {
      this.treeService.addNode({}, 'sibling');
      // this.treeEventEmitter.emit({'type': 'addSibling', 'data' : 'sibling'});
    } else {
      this.toasterService.error('Sorry, this operation is not allowed.');
    }
  }

  getActiveNode() {
    return $(this.tree.nativeElement).fancytree('getTree').getActiveNode();
  }

  attachContextMenu(node, activeNode?) {
    if (_.get(this.config, 'mode') !== 'edit') {
      return;
    }
    const $nodeSpan = $(node.span);
    // const deleteTemplate = `<span> <i class="fa fa-trash-o" type="button"  onclick=""></i> </span>`;
    // tslint:disable-next-line:max-line-length
    const menuTemplate = node.data.root === true ? this.rootMenuTemplate : (node.data.objectType === 'Unit' ? this.folderMenuTemplate : this.contentMenuTemplate);
    const iconsButton = $(menuTemplate);
    if ((node.getLevel() - 1) >= this.config.maxDepth) {
      iconsButton.find("#addchild").remove();
    }

    let contextMenu = $($nodeSpan[0]).find(`#contextMenu`);

    if (!contextMenu.length) {
      $nodeSpan.append(iconsButton);

      if (!activeNode) {
        iconsButton.hide();
      }

      $nodeSpan[0].onmouseover = () => {
        iconsButton.show();
      };

      $nodeSpan[0].onmouseout = () => {
        iconsButton.hide();
      };

      contextMenu = $($nodeSpan[0]).find(`#contextMenu`);

      contextMenu.on('click', (event) => {
        this.treeService.closePrevOpenedDropDown();
        setTimeout(() => {
          const nSpan = $(this.getActiveNode().span);

          const dropDownElement = $(nSpan[0]).find(`#contextMenuDropDown`);
          dropDownElement.removeClass('hidden');
          dropDownElement.addClass('visible');
          _.forEach(_.get(_.first(dropDownElement), 'children'), item => {
            item.addEventListener('click', (ev) => {
              this.treeService.closePrevOpenedDropDown();
              this.handleActionButtons(ev.currentTarget);
              ev.stopPropagation();
            });
          });
        }, 100);
        // event.stopPropagation();
      });

      $($nodeSpan[0]).find(`#removeNodeIcon`).on('click', (ev) => {
        this.showDeleteConfirmationPopUp = true;
      });
    }

  }

  dropNode(node, data) {
    // let objectType;
    // if (data.otherNode.getLevel() === node.getLevel()) {
    //   objectType = node.getParent().data.objectType;
    // } else
    // tslint:disable-next-line:max-line-length
    if (data.otherNode.data.objectType !== 'Content' && (this.maxTreeDepth(data.otherNode) + (node.getLevel() - 1)) > _.get(this.config, 'maxDepth')) {
      return this.dropNotAllowed();
    }
    if (_.get(data, 'otherNode.data.objectType') === 'Content' && !this.checkContentAddition(node, data.otherNode)) {
      return this.dropNotAllowed();
    }
    // else if (data.hitMode === 'before' || data.hitMode === 'after') {
    //   objectType = node.getParent().data.objectType;
    // } else {
    //   objectType = node.data.objectType;
    // }

    // const dropAllowed = _.includes(this.getObjectType(objectType).childrenTypes, data.otherNode.data.objectType);
    // if (dropAllowed) {
    data.otherNode.moveTo(node, data.hitMode);
    return true;
    // } else {
    //   return false;
    // }
  }

    dragDrop(node, data) {
      if ((data.hitMode === 'before' || data.hitMode === 'after' || data.hitMode === 'over') && data.node.data.root) {
        return this.dropNotAllowed();
      }
      if (_.get(this.config, 'maxDepth')) {
        return this.dropNode(node, data);
      }
    }

    dropNotAllowed() {
      // ecEditor.dispatchEvent('org.ekstep.toaster:warning', {
      //   title: 'This operation is not allowed!',
      //   position: 'topCenter',
      //   icon: 'fa fa-warning'
      // })
      this.toasterService.error('This operation is not allowed!');
      return false;
    }

  maxTreeDepth(root) {
    const buffer = [{ node: root, depth: 1 }];
    let current = buffer.pop();
    let max = 0;

    while (current && current.node) {
      // Find all children of this node.
      _.forEach(current.node.children, (child) => {
        buffer.push({ node: child, depth: current.depth + 1 });
      });
      if (current.depth > max) {
        max = current.depth;
      }
      current = buffer.pop();
    }
    return max;
  }

  checkContentAddition(targetNode, contentNode): boolean {
    if (targetNode.data.objectType === 'Content') {
      return false;
    }
    const nodeConfig = this.config.hierarchy[`level${targetNode.getLevel() - 1}`];
    const [Content, QuestionSet] = [_.get(nodeConfig, 'children.Content'), _.get(nodeConfig, 'children.QuestionSet')];
    if (Content && Content.length) {
      return _.includes(Content, _.get(contentNode, 'data.metadata.primaryCategory')) ? true : false;
    }
    if (QuestionSet && QuestionSet.length) {
      return _.includes(QuestionSet, _.get(contentNode, 'data.metadata.primaryCategory')) ? true : false;
    }
    // tslint:disable-next-line:max-line-length
    if (_.get(this.helperService.getChannelData, 'contentPrimaryCategories') && _.includes(_.get(this.helperService.getChannelData, 'contentPrimaryCategories'), _.get(contentNode, 'data.metadata.primaryCategory')) ) {
      return true;
    }
    return false;
  }

  removeNode() {
    this.treeService.removeNode();
    this.telemetryService.interact({ edata: this.getTelemetryInteractEdata('delete-node')});
  }

  handleActionButtons(el) {
    console.log('action buttons -------->', el.id);
    switch (el.id) {
      case 'edit':
        break;
      case 'delete':
        this.showDeleteConfirmationPopUp = true;
        break;
      case 'addsibling':
        this.addSibling();
        this.telemetryService.interact({ edata: this.getTelemetryInteractEdata('add-sibling')});
        break;
      case 'addchild':
        this.addChild();
        this.telemetryService.interact({ edata: this.getTelemetryInteractEdata('add-child')});
        break;
      case 'addresource':
        break;
    }
  }
  addFromLibrary() {
    this.editorService.emitshowLibraryPageEvent('showLibraryPage');
  }
  getTelemetryInteractEdata(id?) {
    return {
      id: id || 'collection-toc',
      type: 'click',
      subtype: 'launch',
      pageid: this.telemetryService.telemetryPageId,
      extra: {
        values: [_.get(this.getActiveNode(), 'data')]
      }
    };
  }

  ngOnDestroy() {
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
  }
}
