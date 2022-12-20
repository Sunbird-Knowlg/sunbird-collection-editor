import {
  Component, ElementRef, EventEmitter, Input,
  OnInit,
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
export class PlainTreeComponent implements OnInit {
  @ViewChild('plainTree') public tree: ElementRef;
  @Input() public treeData;
  @Output() treeEmitter: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
  }

}
