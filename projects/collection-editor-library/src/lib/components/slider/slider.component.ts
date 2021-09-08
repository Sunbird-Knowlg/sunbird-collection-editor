import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfigService } from '../../services/config/config.service';

export class SilderEvent {
  leftAnchor: number;
  step: number;
  rightAnchor:number;
}

@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  sliderValue:any={};
  @Output() public onChange: EventEmitter<SilderEvent> = new EventEmitter<SilderEvent>();
  constructor(public configService: ConfigService) { }

  ngOnInit(): void {
  }

  onValueChange(event,key){
    this.sliderValue[key]=event.target.value
    this.onChange.emit(this.sliderValue);
  }

}
