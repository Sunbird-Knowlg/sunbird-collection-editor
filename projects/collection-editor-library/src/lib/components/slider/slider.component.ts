import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config/config.service';

@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  constructor(public configService: ConfigService) { }

  ngOnInit(): void {
  }

}
