import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from '../../services/config/config.service';
import { EditorService } from '../../services/editor/editor.service';
import * as _ from 'lodash-es';

export class SilderEvent {
  leftAnchor: number;
  step: number;
  rightAnchor: number;
}

@Component({
  selector: 'lib-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  sliderValue:any = {};
  @Input() editorDataInput;
  leftAnchor: any;
  rightAnchor: any;
  step: any;
  @Output() onChange: EventEmitter<SilderEvent> = new EventEmitter<SilderEvent>();
  constructor(public configService: ConfigService,public editorService: EditorService) { }

  ngOnInit(){
    if (_.get(this.editorDataInput,"step")) {
      this.step = this.editorDataInput.step;
      this.sliderValue['step']= this.editorDataInput.step;
    }
    if (_.get(this.editorDataInput,"validation.range.min")) {
      this.leftAnchor = this.editorDataInput.validation.range.min;
      this.sliderValue['leftAnchor']=this.leftAnchor;
    }
    if (_.get(this.editorDataInput,"validation.range.max")) {
      this.rightAnchor = this.editorDataInput.validation.range.max;
      this.sliderValue['rightAnchor']=this.rightAnchor;
    }
  }

  onValueChange(event,key){
    this.sliderValue[key]=event.target.value
    this.onChange.emit(this.sliderValue);
  }

}
