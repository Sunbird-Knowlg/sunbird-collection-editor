// import { Component, OnInit, NgModule, EventEmitter, Output, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
// import { ResourceService } from '../../services/resource/resource.service';
// import * as _ from 'lodash-es';

// @Component({
//   selector: 'app-resources',
//   templateUrl: './resources.component.html',
//   styleUrls: ['./resources.component.scss']
// })
// export class ResourcesComponent implements OnInit {

//   public defaultContentList = [];
//   public contentList = [];
//   public contentCount: number;
//   public viewAllButtonText ="View All";
//   public defaultGridScreen = true;
//   public isLoading = true;
//   public sectionName = '';
//   selectedResources = [];
//   @Output() onProceedClick: EventEmitter<{event: MouseEvent, data: any}> = new EventEmitter();

//   constructor(public resourceService : ResourceService, cdRef : ChangeDetectorRef) { }

//   ngOnInit() {
//     this.isLoading = true;
//     this.resourceService.getResources().subscribe((data: any) => {
//       this.defaultContentList = _.get(data, 'sections') || [];
//       this.defaultContentList.forEach(item => _.map(item.contents, (content) => {
//         content['cardImg'] = content['appIcon'] || '';
//       }));

//       this.isLoading = false;
//     });
//   }

//   showAllList(event, section) {
//     this.sectionName = _.get(section, 'name') || '';
//     this.isLoading = true;
//     this.defaultGridScreen = false;
//     const data = JSON.parse(_.get(section, 'searchQuery'));

//     // Set limit to 50
//     data.request['limit'] = 50;
//     this.resourceService.searchResources(data).subscribe((data: any) => {
//       this.isLoading = false;
//       this.contentList = _.get(data, 'content');
//       this.contentCount = _.get(data, 'count');
//       _.map(this.contentList, (content) => {
//         content['cardImg'] = content['appIcon'] || '';
//       });
//     });
//   }

//   onCardCheckUncheck(event) {
//     const checked  = _.get(event, 'event.target.checked');
//     if (checked === true) {
//       this.selectedResources.push(_.get(event, 'data'));
//     } else {
//       this.selectedResources = this.selectedResources.filter((resource) => resource.identifier !== _.get(event, 'data.identifier'));
//     }
//   }

//   proceedClick(event) {
//     this.onProceedClick.emit({event: event, data: this.selectedResources});
//   }

//   backClick () {
//     this.selectedResources = [];
//     this.defaultGridScreen = true;
//   }
// }
