import { Injectable } from '@angular/core';
import { ServerResponse, Framework, FrameworkData } from '../../interfaces';
import { Observable, BehaviorSubject } from 'rxjs';
import { skipWhile } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { DataService } from '../../services';

@Injectable({
  providedIn: 'root'
})
export class FrameworkService {
  private _organisationFramework: string;
  private _targetFrameworkIds: Array<any> =  [];
  private _frameworkData: FrameworkData = {};
  private _frameworkData$ = new BehaviorSubject<Framework>(undefined);
  public readonly frameworkData$: Observable<Framework> = this._frameworkData$
    .asObservable().pipe(skipWhile(data => data === undefined || data === null));

  constructor(private dataService: DataService) { }

  public initialize(framework: string) {
    if (framework && _.get(this._frameworkData, framework)) {
      this.organisationFramework = framework;
      this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
    } else if (framework && !_.get(this._frameworkData, framework)) {
        this.organisationFramework = framework;
        this.getFrameworkCategories(framework).subscribe(
          (frameworkData: ServerResponse) => {
            this._frameworkData[framework] = frameworkData.result.framework;
            this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
          },
          err => {
            this._frameworkData$.next({ err, frameworkdata: null });
          });
      }
  }

  public getFrameworkCategories(framework: string) {
    const frameworkOptions = {
      url: `framework/v1/read/${framework}`
    };
    return this.dataService.get(frameworkOptions);
  }

  public getTargetFrameworkCategories(frameworkIds: string) {
    _.forEach(frameworkIds, framework => {
      if (framework && _.get(this._frameworkData, framework)) {
        this.targetFrameworkIds = framework;
        this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
      } else {
        this.targetFrameworkIds = framework;
        this.getFrameworkCategories(framework).subscribe(
          (frameworkData: ServerResponse) => {
            this._frameworkData[framework] = frameworkData.result.framework;
            this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
          },
          err => {
            this._frameworkData$.next({ err, frameworkdata: null });
          });
      }
    });
  }

  public get targetFrameworkIds(): any {
    return this._targetFrameworkIds;
  }

  public set targetFrameworkIds(id: any) {
    _.compact(this._targetFrameworkIds.push(id));
  }

  public get organisationFramework(): string {
    return this._organisationFramework;
  }

  public set organisationFramework(framework: string) {
    this._organisationFramework = framework;
  }


}
