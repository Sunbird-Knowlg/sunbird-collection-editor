import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MetaFormComponent } from './meta-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { mockData } from './meta-form.component.spec.data';
import { TreeService } from '../../services/tree/tree.service';
import { mockTreeService } from '../question/question.component.spec.data';
import { HelperService } from '../../services/helper/helper.service';
import { of } from 'rxjs/internal/observable/of';
import { ToasterService } from '../../services/toaster/toaster.service';
import { ConfigService } from '../../services/config/config.service';
describe('MetaFormComponent', () => {
  let component: MetaFormComponent;
  let fixture: ComponentFixture<MetaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MetaFormComponent],
      providers:[
        { provide: TreeService, useValue: mockTreeService },
        ConfigService,
        ToasterService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaFormComponent);
    component = fixture.componentInstance;
    component.appIcon='https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png';
    component.showAppIcon=true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnChanges() should call setAppIconData', () => {
    spyOn(component, 'fetchFrameWorkDetails').and.callFake(() => {});
    spyOn(component, 'setAppIconData').and.callFake(() => {});
    spyOn(component, 'ngOnChanges').and.callThrough();
    component.ngOnChanges();
    expect(component.fetchFrameWorkDetails).toHaveBeenCalled();
    expect(component.setAppIconData).toHaveBeenCalled();
  });

  it('#ngOnChanges() should call helperService.setShuffleValue', () => {
    component.nodeMetadata = {data: {metadata: {shuffle: false}}};
    spyOn(component, 'fetchFrameWorkDetails').and.callFake(() => {});
    spyOn(component, 'setAppIconData').and.callFake(() => {});
    spyOn(component, 'setShuffleValue').and.callFake(() => {});
    spyOn(component, 'ngOnChanges').and.callThrough();
    component.ngOnChanges();
    expect(component.fetchFrameWorkDetails).toHaveBeenCalled();
    expect(component.setAppIconData).toHaveBeenCalled();
    expect(component.setShuffleValue).toHaveBeenCalled();
  });

  it('#ngOnChanges() should not call helperService.setShuffleValue', () => {
    component.nodeMetadata = {data: {metadata: {name: ''}}};
    spyOn(component, 'fetchFrameWorkDetails').and.callFake(() => {});
    spyOn(component, 'setAppIconData').and.callFake(() => {});
    spyOn(component, 'setShuffleValue').and.callFake(() => {});
    spyOn(component, 'ngOnChanges').and.callThrough();
    component.ngOnChanges();
    expect(component.fetchFrameWorkDetails).toHaveBeenCalled();
    expect(component.setAppIconData).toHaveBeenCalled();
    expect(component.setShuffleValue).not.toHaveBeenCalled();
  });

  it('#onStatusChanges() should emit toolbarEmitter event', () => {
    const data = { button: 'onFormStatusChange', event: '' };
    spyOn(component.toolbarEmitter, 'emit');
    component.onStatusChanges(data.event);
    expect(component.toolbarEmitter.emit).toHaveBeenCalledWith(data);
  });

  it('#valueChanges() should call updateNode and emit toolbarEmitter with appIcon', () => {
    // tslint:disable-next-line:max-line-length
    component.appIcon = 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png';
    component.showAppIcon = true;
    const event = {
      instances: 'Add Student',
      appIcon: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png',
      shuffle: true
    };
    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'updateNode').and.callFake(() => {});
    spyOn(component.toolbarEmitter, 'emit').and.callFake(() => {});
    spyOn(component, 'showShuffleMessage').and.callFake(() => {});
    spyOn(component, 'valueChanges').and.callThrough();
    component.valueChanges(event);
    expect(component.valueChanges).toHaveBeenCalledWith(event);
    expect(component.showShuffleMessage).toHaveBeenCalledWith(event);
    expect(component.toolbarEmitter.emit).toHaveBeenCalled();
    expect(treeService.updateNode).toHaveBeenCalled();
  });

  it('#valueChanges() should not call not call showShuffleMessage', () => {
  component.appIcon = '';
  component.showAppIcon = false;
  const treeService = TestBed.get(TreeService);
  spyOn(treeService, 'updateNode').and.callFake(() => {});
  spyOn(component.toolbarEmitter, 'emit').and.callFake(() => {});
  spyOn(component, 'showShuffleMessage').and.callFake(() => {});
  spyOn(component, 'valueChanges').and.callThrough();
  component.valueChanges({});
  expect(component.showShuffleMessage).not.toHaveBeenCalled();
  expect(component.toolbarEmitter.emit).toHaveBeenCalled();
  expect(treeService.updateNode).toHaveBeenCalled();
  });

  it('#showShuffleMessage() should show toaster message', () => {
    const toasterService = TestBed.get(ToasterService);
    component.previousShuffleValue = false;
    spyOn(toasterService, 'simpleInfo').and.callFake(() => {});
    spyOn(component, 'setShuffleValue').and.callFake(() => {});
    spyOn(component, 'showShuffleMessage').and.callThrough();
    component.showShuffleMessage({shuffle: true});
    expect(toasterService.simpleInfo).toHaveBeenCalled();
    expect(component.setShuffleValue).toHaveBeenCalled();
  });

  it('#showShuffleMessage() should not show toaster message', () => {
    const toasterService = TestBed.get(ToasterService);
    component.previousShuffleValue = false;
    spyOn(toasterService, 'simpleInfo').and.callFake(() => {});
    spyOn(component, 'setShuffleValue').and.callFake(() => {});
    spyOn(component, 'showShuffleMessage').and.callThrough();
    component.showShuffleMessage({shuffle: false});
    expect(toasterService.simpleInfo).not.toHaveBeenCalled();
    expect(component.setShuffleValue).toHaveBeenCalled();
  });

  it('#setShuffleValue() should call helperService.setShuffleValue', () => {
    const helperService = TestBed.get(HelperService);
    spyOn(helperService, 'setShuffleValue').and.callFake(() => {});
    spyOn(component, 'setShuffleValue').and.callThrough();
    component.setShuffleValue(true);
    expect(component.setShuffleValue).toHaveBeenCalled();
    expect(helperService.setShuffleValue).toHaveBeenCalled();

  });

  it('#setShuffleValue() should not call helperService.setShuffleValue', () => {
    const helperService = TestBed.get(HelperService);
    spyOn(helperService, 'setShuffleValue').and.callFake(() => {});
    spyOn(component, 'setShuffleValue').and.callThrough();
    component.setShuffleValue('true');
    expect(component.setShuffleValue).toHaveBeenCalled();
    expect(helperService.setShuffleValue).not.toHaveBeenCalled();

  });

  it('#appIconDataHandler() should call updateAppIcon method', () => {
    spyOn(component,'appIconDataHandler').and.callThrough();
    // tslint:disable-next-line:max-line-length
    const event = { url: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png' };
    component.appIcon = event.url;
    spyOn(component.treeService, 'updateAppIcon');
    component.appIconDataHandler(event);
    expect(component.treeService.updateAppIcon).toHaveBeenCalledWith(event.url);
    expect(component.appIconDataHandler).toHaveBeenCalled();
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

});
