import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'jquery.fancytree';
import * as _ from 'lodash-es';



declare var $: any;

@Component({
  selector: 'lib-plain-tree',
  templateUrl: './plain-tree.component.html',
  styleUrls: ['./plain-tree.component.css']
})
export class PlainTreeComponent implements OnInit, AfterViewInit {
  @ViewChild('plainTree') public tree: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.renderTree(this.getTreeConfig());
  }

  renderTree(options) {
    $(this.tree.nativeElement).fancytree(options);
  }

  getTreeConfig() {

    const rootNode = [{
      title: 'Criteria',
      folder: true,
      root: true,
      icon: 'fa fa-folder-o'
    }]
    const options: any = {
      extensions: ['glyph', 'dnd5'],
      clickFolderMode: 3,
      source: rootNode,
      escapeTitles: true,
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
      init: (event, data) => { },
      click: (event, data): boolean => {
        this.tree.nativeElement.click();
        return true;
      },
      activate: (event, data) => {
      },
      renderNode: (event, data) => {
        const node = data.node;
        const $nodeSpan = $(node.span);

        // check if span of node already rendered
        if (!$nodeSpan.data('rendered')) {

          // span rendered
          $nodeSpan.data('rendered', true);

        }
      }
    };
    return options;
  }
}
