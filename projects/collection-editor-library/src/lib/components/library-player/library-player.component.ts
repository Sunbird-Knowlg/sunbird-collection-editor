import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lib-library-player',
  templateUrl: './library-player.component.html',
  styleUrls: ['./library-player.component.scss']
})
export class LibraryPlayerComponent implements OnInit {
@Input() contentListDetails;
  constructor() { }

  ngOnInit() {
  }

}
