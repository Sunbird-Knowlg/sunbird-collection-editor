// import { ActionService } from './../../../core/services/action/action.service';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import * as _ from 'lodash-es';
// import { map } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class ResourceService {

//   getResources(): Observable<any> {
//     const req = {
//       url: 'data/v1/page/assemble',
//       data: {"request":{"source":"web","filters":{"visibility":"Default"},"name":"ContentBrowser"}}
//     };
//     return this.actionService.post(req).pipe(map((res: any) => _.get(res, 'result.response')));
//   }

//   searchResources(request): Observable<any> {
//     const req = {
//       url: 'composite/v3/search',
//       data: request
//     };
//     return this.actionService.post(req).pipe(map((res: any) => _.get(res, 'result')));
//   }

//   constructor(public actionService: ActionService) { }
// }
