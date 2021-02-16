import { EventEmitter, Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { CsTelemetryModule } from '@project-sunbird/client-services/telemetry';
import { IEditorConfig } from '../../interfaces/editor.config';
import { Context } from '../../interfaces/inputConfig';
import { HelperService } from '../helper/helper.service';
@Injectable({
  providedIn: 'root'
})
export class EditorTelemetryService {
  duration: number;
  channel: string;
  telemetryEvent = new EventEmitter<any>();
  private context: Context;
  private telemetryObject: any;
  private contentSessionId: string;
  private playSessionId: string;
  private pdata: any;
  private sid: string;
  private uid: string;
  private rollup: any;
  private env: string;
  // tslint:disable-next-line:variable-name
  private _telemetryPageId: any;

  constructor( public helperService: HelperService ) {}

  initializeTelemetry(config: IEditorConfig) {
    this.duration = new Date().getTime();
    this.context = config.context;
    this.channel = config.context.channel;
    this.contentSessionId = this.helperService.uniqueId();
    this.playSessionId = this.helperService.uniqueId();
    this.channel = config.context.channel;
    this.pdata = this.context.pdata;
    this.sid =  this.context.sid;
    this.uid =  this.context.uid;
    this.env =  this.context.env;
    this.rollup = this.context.contextRollup;
    if (!CsTelemetryModule.instance.isInitialised) {
      CsTelemetryModule.instance.init({});
      CsTelemetryModule.instance.telemetryService.initTelemetry(
        {
          config: {
            pdata: config.context.pdata,
            env: config.context.env,
            channel: config.context.channel,
            did: config.context.did,
            authtoken: config.context.authToken || '',
            uid: config.context.uid || '',
            sid: config.context.sid,
            batchsize: 20,
            mode: config.context.mode,
            host: config.context.host || '',
            endpoint: config.context.endpoint || '/data/v3/telemetry',
            tags: config.context.tags,
            cdata: _.merge(this.context.cdata, [{ id: this.contentSessionId, type: 'ContentSession' },
            { id: this.playSessionId, type: 'PlaySession' }])
          },
          userOrgDetails: {}
        }
      );
    }

    this.telemetryObject = {
      id: config.context.identifier,
      type: 'Content',
      ver: '1.0', // TODO :: config.metadata.pkgVersion + ''
      rollup: this.context.objectRollup || {}
    };
  }

  set telemetryPageId(value: any) {
    this._telemetryPageId = value;
  }

  get telemetryPageId() {
    return this._telemetryPageId;
  }

  getTelemetryInteractEdata(id: string, type: string, subtype: string, pageid: string, extra?: any) {
    return _.omitBy({
      id,
      type,
      subtype,
      pageid,
      extra
    }, _.isUndefined);
  }

  public start(edata) {
    CsTelemetryModule.instance.telemetryService.raiseStartTelemetry(
      {
        options: this.getEventOptions(),
        edata
      }
    );
  }
  public end(edata) {
    CsTelemetryModule.instance.telemetryService.raiseEndTelemetry({
      edata,
      options: this.getEventOptions()
    });
  }

  public interact(eventData) {
    CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
      options: this.getEventOptions(),
      edata: eventData.edata
    });
  }


  public impression(edata) {
    CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
      options: this.getEventOptions(),
      edata
    });
  }

  public error(edata) {
    CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry({
      edata
    });
  }

  public getEventOptions() {
    return ({
      object: this.telemetryObject,
      context: {
        channel: this.channel,
        pdata: this.pdata,
        env: this.env,
        sid: this.sid,
        uid: this.uid,
        cdata: _.merge(this.context.cdata, [{ id: this.contentSessionId, type: 'ContentSession' },
            { id: this.playSessionId, type: 'PlaySession' }]),
        rollup: this.rollup || {}
      }
    });
  }

}
