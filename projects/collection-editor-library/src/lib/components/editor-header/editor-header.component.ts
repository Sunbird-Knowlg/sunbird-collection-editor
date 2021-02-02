import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'lib-editor-header',
  templateUrl: './editor-header.component.html',
  styleUrls: ['./editor-header.component.scss']
})
export class EditorHeaderComponent implements OnInit {

  @Input() toolbarConfig: any;
  @Output() toolbarEmitter = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  buttonEmitter(event, button) {
    this.toolbarEmitter.emit({event, button});
  }

}
