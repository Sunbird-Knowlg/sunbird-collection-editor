import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input,
  Output, ViewChild
} from '@angular/core';
import 'jquery.fancytree';
import * as _ from 'lodash-es';
declare var $: any;


@Component({
  selector: 'lib-plain-tree',
  templateUrl: './plain-tree.component.html',
  styleUrls: ['./plain-tree.component.scss']
})
export class PlainTreeComponent implements AfterViewInit {
  @ViewChild('plainTree') public tree: ElementRef;
  @Input() public treeData;
  @Output() treeEmitter: EventEmitter<any> = new EventEmitter<any>();

  getTreeConfig() {
    const rootNode = [
      {
        title: 'Criteria Name',
        key: '2',
        folder: true,
        root: true,
        icon: 'fa fa-folder-o',
        children: this.buildTreeData(this.treeData)
      }
    ];
    const options = {
      extensions: ['glyph', 'dnd5'],
      clickFolderMode: 3,
      source: rootNode,
      escapeTitles: true,
      glyph: {
        preset: 'awesome4',
        map: {
          folder: 'icon folder sb-fancyTree-icon',
          folderOpen: 'icon folder outline sb-fancyTree-icon',
        },
      },
      dnd5: {
        autoExpandMS: 400,
        // focusOnClick: true,
        preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
        preventRecursion: true, // Prevent dropping nodes on own descendants
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
        },
      },
      init: (event, data) => {},
      click: (event, data): boolean => {
        this.tree.nativeElement.click();
        return true;
      },
      activate: (event, data) => {
       // tslint:disable-next-line:no-unused-expression
       !_.isUndefined(data.node.data.id) ? this.getQuestionsList(_.get(data, 'node.data.id')) : '';
      },
      renderNode: (event, data) => {
        const node = data.node;
        const $nodeSpan = $(node.span);

        // check if span of node already rendered
        if (!$nodeSpan.data('rendered')) {
          // span rendered
          $nodeSpan.data('rendered', true);
        }
      },
    };
    return options;
  }

  buildTreeData(data) {
    const tree = [];
    _.forEach(data, (child) => {
      if (child?.children) {
        // tslint:disable-next-line:no-shadowed-variable
        _.forEach(child?.children, (data) => {
          tree.push({
            id: data?.id,
            title: data?.title,
            tooltip: data?.tooltip,
            folder: true,
            root: false,
            icon: 'fa fa-folder-o'
          });
        });
      }
     });
    return tree;
  }

  ngAfterViewInit() {
    this.renderTree(this.getTreeConfig());
  }

  renderTree(options) {
    $(this.tree.nativeElement).fancytree(options);
  }

  getQuestionsList(id) {
    this.treeEmitter.emit({identifier: id});
  }

}
