import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlainTreeComponent } from './plain-tree.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PlainTreeComponent', () => {
  let component: PlainTreeComponent;
  let fixture: ComponentFixture<PlainTreeComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ PlainTreeComponent ],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainTreeComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('#buildTreeData should call', () => {
  //    spyOn(component, 'buildTreeData').and.callThrough();
  //    component.buildTreeData(mockTreedata);
  //    expect(component.buildTreeData).toHaveBeenCalledWith(mockTreedata);
  // });

  // it('#ngAfterViewInit() should call #getTreeConfig() and #renderTree()', () => {
  //   spyOn(component, 'ngAfterViewInit').and.callThrough();
  //   spyOn(component, 'getTreeConfig').and.returnValue(mockTreedata);
  //   spyOn(component, 'renderTree').and.callFake(() => {} );
  //   component.ngAfterViewInit();
  //   expect(component.renderTree).toHaveBeenCalled();
  //   expect(component.getTreeConfig).toHaveBeenCalled();
  // });

  // it('#getQuestionsList should call', () => {
  //   spyOn(component, 'getQuestionsList').and.callThrough();
  //   spyOn(component.treeEmitter, 'emit');
  //   component.getQuestionsList('do_123');
  //   expect(component.treeEmitter.emit).toHaveBeenCalledWith({identifier : 'do_123'});
  // });

  // it('getTreeConfig should call', () => {
  //   spyOn(component, 'getTreeConfig').and.callThrough();
  //   spyOn(component, 'buildTreeData').and.returnValue(mockTreedata);
  //   let data;
  //   data = component.getTreeConfig();
  //   expect(component.getTreeConfig).toHaveBeenCalled();
  //   expect(data).toBeDefined();
  //   expect(component.buildTreeData).toHaveBeenCalled();
  // });

});
