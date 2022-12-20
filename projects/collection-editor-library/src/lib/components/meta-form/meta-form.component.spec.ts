import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MetaFormComponent } from './meta-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { mockData } from './meta-form.component.spec.data';
import { TreeService } from '../../services/tree/tree.service';
import { mockTreeService } from '../question/question.component.spec.data';
import { HelperService } from '../../services/helper/helper.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { ConfigService } from '../../services/config/config.service';
import { EditorService } from '../../services/editor/editor.service';
import { FrameworkService } from '../../services/framework/framework.service';
import { of, throwError } from 'rxjs';
describe('MetaFormComponent', () => {
  let component: MetaFormComponent;
  let fixture: ComponentFixture<MetaFormComponent>;

  beforeEach(waitForAsync(() => {
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
    // tslint:disable-next-line:max-line-length
    component.appIcon = 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png';
    component.showAppIcon = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#valueChanges() should call updateNode and emit data for obs with rubrics', () => {
    spyOn(component, 'valueChanges').and.callThrough();
    // tslint:disable-next-line:max-line-length
    component.appIcon = 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png';
    component.showAppIcon = true;
    const event = {
      instances: 'Add Student',
      appIcon: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png',
      allowECM : 'No',
      levels : ['good', 'bad', 'average'],
      setPeriod : 'No'
    };
    spyOn(component, 'createLeavels').and.returnValue({
        L1: {
            label: 'Good'
        }
    });
    spyOn(component.toolbarEmitter, 'emit');
    component.valueChanges(event);
    expect(component.valueChanges).toHaveBeenCalledWith(event);
  });

  it('#createLeavels should call when the levels are defined', () => {
    spyOn(component, 'createLeavels').and.callThrough();
    const levels = ['good'];
    component.createLeavels(levels);
    expect(component.createLeavels).toHaveBeenCalledWith(levels);
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

  it('#setShuffleValue() should call helperService.setShuffleValue', () => {
    const helperService = TestBed.inject(HelperService);
    spyOn(helperService, 'setShuffleValue').and.callFake(() => {});
    spyOn(component, 'setShuffleValue').and.callThrough();
    component.setShuffleValue(true);
    expect(component.setShuffleValue).toHaveBeenCalled();
    expect(helperService.setShuffleValue).toHaveBeenCalled();
  });

  it('#setShuffleValue() should not call helperService.setShuffleValue', () => {
    const helperService = TestBed.inject(HelperService);
    spyOn(helperService, 'setShuffleValue').and.callFake(() => {});
    spyOn(component, 'setShuffleValue').and.callThrough();
    component.setShuffleValue('true');
    expect(component.setShuffleValue).toHaveBeenCalled();
    expect(helperService.setShuffleValue).not.toHaveBeenCalled();

  });

  it('#setAppIconData() should set appIcon as editable', () => {
    component.showAppIcon = false;
    component.nodeMetadata = mockData.nodeMetaData;
    component.rootFormConfig = mockData.rootFormConfig;
    spyOn(component, 'isReviewMode').and.returnValue(false);
    spyOn(component, 'setAppIconData').and.callThrough();
    spyOn(component, 'ifFieldIsEditable').and.callFake(() => {return false});
    component.appIconConfig = {
      isAppIconEditable: true
    };
    component.setAppIconData();
    expect(component.showAppIcon).toBeTruthy();
    expect(component.appIcon).toBeDefined();
    expect(component.isReviewMode).toHaveBeenCalled();
    expect(component.appIconConfig.isAppIconEditable).toBeTruthy();
    expect(component.ifFieldIsEditable).toHaveBeenCalled();
  });

  it('#setAppIconData() should set appIcon as non editable', () => {
    component.appIcon = undefined;
    component.showAppIcon = false;
    component.nodeMetadata = {data: {root: true, metadata: {}}};
    component.rootFormConfig = mockData.rootFormConfigWithoutGrouping;
    spyOn(component, 'isReviewMode').and.returnValue(true);
    spyOn(component, 'setAppIconData').and.callThrough();
    spyOn(component, 'ifFieldIsEditable').and.callFake(() => {return false});
    component.appIconConfig = {
      isAppIconEditable: true
    };
    component.setAppIconData();
    expect(component.showAppIcon).toBeTruthy();
    // expect(component.appIcon).toBeDefined();
    expect(component.appIcon).toBeUndefined();
    expect(component.isReviewMode).toHaveBeenCalled();
    expect(component.appIconConfig.isAppIconEditable).toBeFalsy();
    expect(component.ifFieldIsEditable).toHaveBeenCalled();
  });

  it('#fetchFrameWorkDetails() should set fetchFrameWorkDetails and for targetFrameworkIds', () => {
    const frameworkService = TestBed.inject(FrameworkService);
    const response = mockData.serverResponse;
    response.result = mockData.frameworkResponse.result;
    spyOn(frameworkService, 'getFrameworkCategories').and.returnValue(of(response));
    frameworkService.initialize('ekstep_ncert_k-12');
    spyOn(component, 'attachDefaultValues').and.callFake(() => {});
    spyOn(component, 'fetchFrameWorkDetails').and.callThrough();
    component.fetchFrameWorkDetails();
    expect(component.frameworkDetails).toBeDefined();
  });

  it('#fetchFrameWorkDetails() should set fetchFrameWorkDetails and for empty organisationFramework', () => {
    component.frameworkDetails = mockData.frameWorkDetails;
    component.frameworkService.organisationFramework = '';
    component.frameworkService.targetFrameworkIds = 'ekstep_ncert_k-12';
    spyOn(component, 'attachDefaultValues').and.callFake(() => {});
    spyOn(component, 'fetchFrameWorkDetails').and.callThrough();
    component.fetchFrameWorkDetails();
    expect(component.frameworkDetails).toBeDefined();
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

  it('call #isReviewMode() verify returning value', () => {
    const editorService = TestBed.inject(EditorService);
    spyOnProperty(editorService, 'editorMode').and.returnValue('review');
    spyOn(component, 'isReviewMode').and.callThrough();
    const isReviewMode = component.isReviewMode();
    expect(isReviewMode).toBeTruthy();
  });

  it('call #ifFieldIsEditable() verify returning value', () => {
    const editorService = TestBed.inject(EditorService);
    spyOnProperty(editorService, 'editorMode').and.returnValue('review');
    spyOnProperty(editorService, 'editorConfig').and.returnValue({config: {editableFields: {review: ['name']}}});
    spyOn(component, 'isReviewMode').and.returnValue(true);
    spyOn(component, 'ifFieldIsEditable').and.callThrough();
    const isFieldEditable = component.ifFieldIsEditable('name', false);
    expect(isFieldEditable).toBeTruthy();
  });

  it('outputData should be called', () => {
    spyOn(component, 'outputData').and.callThrough();
    component.outputData({});
    expect(component.outputData).toHaveBeenCalledWith({});
  });

  it('#onStatusChanges() should emit toolbarEmitter event', () => {
    const data = { button: 'onFormStatusChange', event: '' };
    spyOn(component.toolbarEmitter, 'emit').and.callFake(() => {});
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
    const treeService = TestBed.inject(TreeService);
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
  const treeService = TestBed.inject(TreeService);
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
    const toasterService = TestBed.inject(ToasterService);
    const helperService = TestBed.inject(HelperService);
    helperService.shuffleValue = of(false);
    component.previousShuffleValue = false;
    spyOn(toasterService, 'simpleInfo').and.callFake(() => {});
    spyOn(component, 'setShuffleValue').and.callFake(() => {});
    spyOn(component, 'showShuffleMessage').and.callThrough();
    component.showShuffleMessage({shuffle: true});
    expect(toasterService.simpleInfo).toHaveBeenCalled();
    expect(component.setShuffleValue).toHaveBeenCalledWith(true);
  });

  it('#showShuffleMessage() should not show toaster message', () => {
    const toasterService = TestBed.inject(ToasterService);
    component.previousShuffleValue = false;
    spyOn(toasterService, 'simpleInfo').and.callFake(() => {});
    spyOn(component, 'setShuffleValue').and.callFake(() => {});
    spyOn(component, 'showShuffleMessage').and.callThrough();
    component.showShuffleMessage({shuffle: false});
    expect(toasterService.simpleInfo).not.toHaveBeenCalled();
    expect(component.setShuffleValue).toHaveBeenCalledWith(false);
  });

  it('#appIconDataHandler() should call updateAppIcon method', () => {
    // tslint:disable-next-line:max-line-length
    const event = { url: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png' };
    component.appIcon = event.url;
    spyOn(component.treeService, 'updateAppIcon').and.callFake(() => {});
    spyOn(component, 'appIconDataHandler').and.callThrough();
    component.appIconDataHandler(event);
    expect(component.appIconDataHandler).toHaveBeenCalled();
    expect(component.treeService.updateAppIcon).toHaveBeenCalledWith(event.url);
  });
});
