import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateComponent } from './template.component';

describe('TemplateComponent', () => {
  let component: TemplateComponent;
  let fixture: ComponentFixture<TemplateComponent>;
  const templateList = [{ type: 'Multile Choice Question' }, { type: 'Subjective Question'}];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disabled #next button initial', () => {
    expect(component.showButton).toBeFalsy();
  });

  it('should set #templateList value initial', () => {
    expect(component.templateList).toBeUndefined();
    component.templateList = templateList;
    expect(component.templateList).not.toBeUndefined();
  });

  it('should set #templateSelected value when template selected', () => {
    component.templateSelected = templateList[0];
    expect(component.templateSelected).toEqual(templateList[0]);
  });

  it('#next() should emit #templateSelection event when #next button cliked!', () => {
    spyOn(component.templateSelection, 'emit');
    component.templateSelected = templateList[0];
    component.next();
    expect(component.templateSelection.emit).toHaveBeenCalledWith(templateList[0]);
  });


});
