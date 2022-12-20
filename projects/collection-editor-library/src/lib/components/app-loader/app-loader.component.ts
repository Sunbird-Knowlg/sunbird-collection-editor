import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import {ILoaderMessage} from '../../interfaces/loader';
import { ConfigService } from '../../services/config/config.service';
import * as _ from 'lodash-es';

/**
 * loader component
 */
@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html'
})
export class AppLoaderComponent implements OnInit {
  @Input() data: ILoaderMessage;
  headerMessage: string;
  loaderMessage: string;

  constructor(public configService: ConfigService) {
    this.headerMessage =  _.get(this.configService, 'labelConfig.lbl.loaderHeading');
    this.loaderMessage =  _.get(this.configService, 'labelConfig.lbl.loaderMessage');
  }

  ngOnInit() {
    if (this.data) {
      this.headerMessage = this.data.headerMessage || this.headerMessage;
      this.loaderMessage = this.data.loaderMessage || this.loaderMessage;
    }
  }
}
