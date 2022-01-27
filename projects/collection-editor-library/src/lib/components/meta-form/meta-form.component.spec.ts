import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MetaFormComponent } from './meta-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { mockData } from './meta-form.component.spec.data';
import { TreeService } from '../../services/tree/tree.service';
import { mockTreeService } from '../question/question.component.spec.data';
describe('MetaFormComponent', () => {
  let component: MetaFormComponent;
  let fixture: ComponentFixture<MetaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MetaFormComponent],
      providers:[
        { provide: TreeService, useValue: mockTreeService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#ngOnChanges() should call setAppIconData', () => {
    spyOn(component, 'fetchFrameWorkDetails');
    spyOn(component, 'setAppIconData');
    component.ngOnChanges();
    expect(component.fetchFrameWorkDetails).toHaveBeenCalled();
    expect(component.setAppIconData).toHaveBeenCalled();
  });



  it('#onStatusChanges() should emit toolbarEmitter event', () => {
    const data = { button: 'onFormStatusChange', event: '' };
    spyOn(component.toolbarEmitter, 'emit');
    component.onStatusChanges(data.event);
    expect(component.toolbarEmitter.emit).toHaveBeenCalledWith(data);
  });
  it('#appIconDataHandler() should call updateAppIcon method', () => {
    // tslint:disable-next-line:max-line-length
    const data = { url: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png' };
    component.appIcon = data.url;
    spyOn(component.treeService, 'updateAppIcon');
    component.appIconDataHandler(data);
    expect(component.treeService.updateAppIcon).toHaveBeenCalledWith(data.url);
  });
  it('#setAppIconData() should set appIcon', () => {
    spyOn(component,'setAppIconData').and.callThrough();
    const nodeMetadataMock = {
      data: {
        // tslint:disable-next-line:max-line-length
        metadata: { appIcon: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png' }
      }
    };
    component.nodeMetadata = nodeMetadataMock;
    component.appIconConfig = {
      isAppIconEditable: true
    };
    component.setAppIconData();
    expect(component.appIcon).toBeDefined();
  });
  it('call #ifFieldIsEditable() verify returning value', () => {
    spyOn(component, 'isReviewMode').and.returnValue(false);
    expect(component.ifFieldIsEditable('bloomsLevel', false)).toEqual(false);
  });
  it('call #isReviewMode() verify returning value', () => {
    expect(component.isReviewMode()).toEqual(false);
  });
 
  
  it('#attachDefaultValues() should set formFieldProperties', () => {
    component.rootFormConfig = mockData.rootFormConfig;
    component.nodeMetadata = mockData.nodeMetaData;
    component.frameworkDetails = mockData.frameWorkDetails;
    component.frameworkService.organisationFramework = '';
    component.frameworkService.targetFrameworkIds = 'ekstep_ncert_k-12';
    component.attachDefaultValues();
    expect(component.formFieldProperties).toBeDefined();
  });
  it('#fetchFrameWorkDetails() should set fetchFrameWorkDetails and for targetFrameworkIds', () => {
    component.frameworkService.organisationFramework = 'ekstep_ncert_k-12';
    component.frameworkService.targetFrameworkIds = 'ekstep_ncert_k-12';
    component.frameworkDetails = mockData.frameWorkDetails;
    spyOn(component, 'attachDefaultValues');
    component.fetchFrameWorkDetails();
    expect(component.frameworkDetails).toBeDefined();
  });
  it('#fetchFrameWorkDetails() should set fetchFrameWorkDetails and for empty organisationFramework', () => {
    component.frameworkDetails = mockData.frameWorkDetails;
    component.frameworkService.organisationFramework = '';
    component.frameworkService.targetFrameworkIds = 'ekstep_ncert_k-12';
    spyOn(component, 'attachDefaultValues');
    component.fetchFrameWorkDetails();
    expect(component.frameworkDetails).toBeDefined();
  });

  it('#valueChanges() should call updateNode and emit toolbarEmitter with appIcon', () => {
    spyOn(component,'valueChanges').and.callThrough();
    component.appIcon='https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png';
    component.showAppIcon=true;
    const event={
      appIcon: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png',
      setPeroid:true
    }
    spyOn(component.toolbarEmitter, 'emit');
    spyOn(component.treeService, 'updateNode');
    component.valueChanges(event);
    const treeService = TestBed.get(TreeService);
    expect(treeService.updateNode).toHaveBeenCalledWith(event);
    expect(component.valueChanges).toHaveBeenCalledWith(event);
  });


});
