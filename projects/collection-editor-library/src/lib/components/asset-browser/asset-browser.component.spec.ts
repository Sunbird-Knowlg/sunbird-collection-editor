import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AssetBrowserComponent } from './asset-browser.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {mockData} from './asset-browser.component.spec.data';

describe('AssetBrowserComponent', () => {
  let component: AssetBrowserComponent;
  let fixture: ComponentFixture<AssetBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ InfiniteScrollModule, HttpClientTestingModule ],
      declarations: [ AssetBrowserComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit() should call #getAcceptType()', () => {
    component.assetConfig.image.accepted = 'dummyData';
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'getAcceptType').and.callThrough();
    component.ngOnInit();
    expect(component.getAcceptType).toHaveBeenCalledWith('dummyData', 'image');
  });

  it('#initializeImagePicker() should set showImagePicker to true', () => {
    spyOn(component, 'initializeImagePicker').and.callThrough();
    component.initializeImagePicker();
    expect(component.showImagePicker).toBeTruthy();
  });

  it('#addImageInEditor() should set showImagePicker to false', () => {
    spyOn(component, 'addImageInEditor').and.callThrough();
    component.addImageInEditor(mockData.assetBrowserEvent.url, '12345');
    expect(component.showImagePicker).toBeFalsy();
  });

  it('#addImageInEditor() should set appIcon value', () => {
    spyOn(component, 'addImageInEditor').and.callThrough();
    component.addImageInEditor(mockData.assetBrowserEvent.url, '12345');
    expect(component.appIcon).toBe(mockData.assetBrowserEvent.url);
  });

  it('#addImageInEditor() should emit proper event', () => {
    spyOn(component, 'addImageInEditor').and.callThrough();
    spyOn(component.assetBrowserEmitter, 'emit').and.returnValue(mockData.assetBrowserEvent);
    component.addImageInEditor(mockData.assetBrowserEvent.url, '12345');
    expect(component.assetBrowserEmitter.emit).toHaveBeenCalledWith(mockData.assetBrowserEvent);
  });

  it('#dismissImageUploadModal() should set showImagePicker to true', () => {
    spyOn(component, 'dismissImageUploadModal').and.callThrough();
    component.dismissImageUploadModal();
    expect(component.showImagePicker).toBeTruthy();
  });

  it('#dismissImageUploadModal() should set showImageUploadModal to false', () => {
    spyOn(component, 'dismissImageUploadModal').and.callThrough();
    component.dismissImageUploadModal();
    expect(component.showImageUploadModal).toBeFalsy();
  });
  it('#lazyloadMyImages() should get my images ', () => {
    spyOn(component, 'getMyImages');
    component.lazyloadMyImages();
    expect(component.getMyImages).toHaveBeenCalledWith(0);
  });
  it('#lazyloadMyImages() should get all images', () => {
    spyOn(component, 'getAllImages');
    component.lazyloadAllImages();
    expect(component.getAllImages).toHaveBeenCalledWith(0);
  });
  it('#dismissImagePicker() should emit modalDismissEmitter  ', () => {
    component.showImagePicker = true;
    spyOn(component, 'getMyImages');
    spyOn(component.modalDismissEmitter, 'emit');
    component.dismissImagePicker();
    expect(component.showImagePicker).toBeFalsy();
    expect(component.modalDismissEmitter.emit).toHaveBeenCalledWith({});
  });
  it('#ngOnDestroy() should call modal deny ', () => {
    component['modal'] = {
      deny: jasmine.createSpy('deny')
    };
    component.ngOnDestroy();
    expect(component['modal'].deny).toHaveBeenCalled();
  });
  it('#getMediaOriginURL() should get MediaOriginURL', () => {
    component.assetProxyUrl = '/assets/public/';
    const url = 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png';
    component.getMediaOriginURL(url);
  });
});
