import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-collection-icon',
  templateUrl: './collection-icon.component.html',
  styleUrls: ['./collection-icon.component.scss']
})
export class CollectionIconComponent implements OnInit {
  @Input() appIcon;
  @Input() appIconConfig;
  @Output() iconEmitter = new EventEmitter<any>();
  public showImagePicker = false;

  constructor() { }

  ngOnInit() {
    console.log('appIconConfig', this.appIconConfig);
    
  }

  initializeImagePicker() {
    this.showImagePicker = true;
  }

  collectionIconHandler(event) {
   this.iconEmitter.emit(event);
   this.appIcon = event.url;
   this.showImagePicker = false;
  }

  handleModalDismiss(event) {
    this.showImagePicker = false;
  }

}
