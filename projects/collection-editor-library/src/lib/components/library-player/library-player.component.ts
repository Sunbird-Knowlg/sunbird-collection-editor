import { Component, OnInit, Input } from '@angular/core';
import {labelMessages} from '../labels';

@Component({
  selector: 'lib-library-player',
  templateUrl: './library-player.component.html',
  styleUrls: ['./library-player.component.scss']
})
export class LibraryPlayerComponent implements OnInit {
@Input() contentListDetails;
labelMessages = labelMessages;
  constructor() { }

  ngOnInit() {
  }

}
