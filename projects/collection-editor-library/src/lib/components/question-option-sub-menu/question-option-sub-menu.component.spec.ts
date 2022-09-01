import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { QuestionOptionSubMenuComponent } from './question-option-sub-menu.component';
import { mockData } from './question-option-sub-menu.spec.data';

describe('QuestionOptionSubMenuComponent', () => {
  let component: QuestionOptionSubMenuComponent;
  let fixture: ComponentFixture<QuestionOptionSubMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      declarations: [QuestionOptionSubMenuComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionOptionSubMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#onMenuClick() should enable the submenu if type is input ', () => {
    component.subMenus = mockData.subMenus;
    spyOn(component, 'onMenuClick').and.callThrough();
    component.onMenuClick(1)
    expect(component.subMenus[1].enabled).toBe(true);
  });
  it('#onMenuClick() should push dependant question if input value is array ', () => {
    component.subMenus = mockData.subMenus;
    spyOn(component, 'onMenuClick').and.callThrough();
    component.onMenuClick(2)
    expect(component.subMenus[2].value.length).toBe(0);
  });
  it('#onValueChange() should emit the value if type is input ', () => {
    component.subMenus = mockData.subMenus;
    spyOn(component, 'onValueChange').and.callThrough();
    spyOn(component.onChange, 'emit')

    let ev = {
      target:{value:'text'}
    }
    component.onValueChange(ev,1)
    expect(component.onValueChange).toHaveBeenCalled();
    expect(component.onChange.emit).toHaveBeenCalled()
  });
});
