import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlainTreeComponent } from './plain-tree.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { mockTreedata } from './plain-tree.component.spec.data';

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

  it('#buildTreeData should call', async () => {
    expect(component.buildTreeData).toBeDefined();
    component.buildTreeData(mockTreedata);
  });

  it('#ngAfterViewInit() should call #getTreeConfig() and #renderTree()', () => {
    spyOn(component, 'getTreeConfig').and.callFake(() => {});
    spyOn(component, 'renderTree').and.callFake(() => {});
    spyOn(component, 'ngAfterViewInit').and.callThrough();
    component.ngAfterViewInit();
    expect(component.getTreeConfig).toHaveBeenCalled();
    expect(component.renderTree).toHaveBeenCalled();
  });

  it('#getQuestionsList should call', () => {
    spyOn(component, 'getQuestionsList').and.callThrough();
    spyOn(component.treeEmitter, 'emit');
    component.getQuestionsList('do_123');
    expect(component.treeEmitter.emit).toHaveBeenCalledWith({identifier : 'do_123'});
  });

  it('getTreeConfig should call', () => {
    spyOn(component, 'buildTreeData').and.returnValue(mockTreedata);
    expect(component.getTreeConfig).toBeDefined();
    component.getTreeConfig();
  });
});
