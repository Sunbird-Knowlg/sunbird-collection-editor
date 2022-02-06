import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { mockConfigService, mockData } from "./slider.component.spec.data";
import { SliderComponent } from "./slider.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ConfigService } from '../../services/config/config.service';

describe("SliderComponent", () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SliderComponent],
      providers:[
        { provide: ConfigService, useValue: mockConfigService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
    component.sliderValue = {};
    component.editorDataInput = mockData.editorDataInput;
    // fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call the ngOnInit", () => {
    component.editorDataInput = mockData.editorDataInput;
    spyOn(component, "ngOnInit").and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it("should call the ngOnInit when editorDataInput is undefined", () => {
    component.sliderValue = {};
    component.editorDataInput = {};
    spyOn(component, "ngOnInit").and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it("#onValueChange() should emit  onChange with data for rightAnchor", () => {
    spyOn(component,'onValueChange').and.callThrough();
    spyOn(component.onChange, "emit");
    component.onValueChange(mockData.changeEvent.event, "rightAnchor");
    expect(component.onChange.emit).toHaveBeenCalledWith({ rightAnchor: 10 });
    expect(component.onValueChange).toHaveBeenCalled();
    expect(component.sliderValue.rightAnchor).toBe(10);
  });

});
