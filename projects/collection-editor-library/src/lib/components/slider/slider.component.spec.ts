import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { mockData } from "./slider.component.spec.data";

import { SliderComponent } from "./slider.component";

describe("SliderComponent", () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SliderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call the ngOnInit", () => {
    spyOn(component, "ngOnInit").and.callThrough();
    component.sliderValue = {};
    component.editorDataInput = mockData.editorDataInput;
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it("#onValueChange() should emit  onChange with data", () => {
    spyOn(component.onChange, "emit");
    component.onValueChange(mockData.changeEvent.event, "rightAnchor");
    expect(component.onChange.emit).toHaveBeenCalledWith({ rightAnchor: 10 });
  });
});
