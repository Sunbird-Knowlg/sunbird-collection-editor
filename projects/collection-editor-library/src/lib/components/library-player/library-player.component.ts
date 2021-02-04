import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-library-player',
  templateUrl: './library-player.component.html',
  styleUrls: ['./library-player.component.scss']
})
export class LibraryPlayerComponent implements OnInit {
@Input() contentListDetails;
@Output() moveEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  addToLibrary() {
    this.moveEvent.emit({
      action: 'beforeMove'
    });
  }

}
