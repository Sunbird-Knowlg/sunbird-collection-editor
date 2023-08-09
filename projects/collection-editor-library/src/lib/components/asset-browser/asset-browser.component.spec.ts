import { QuestionService } from './../../services/question/question.service';
import { ComponentFixture, TestBed, inject, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AssetBrowserComponent } from './asset-browser.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { mockData } from './asset-browser.component.spec.data';
import { FormsModule } from '@angular/forms';
import { EditorService } from '../../services/editor/editor.service';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash-es';
declare const SunbirdFileUploadLib: any;
const mockEditorService = {
  editorConfig: {
    config: {
      assetConfig: {
        image: {
          size: '1',
          accepted: 'png, jpeg'
        }
      }
    },
    context: {
      user: {
        id: 123,
        fullName: 'Ram Gopal',

      },
      channel: 'sunbird'
    }
  },
  appendCloudStorageHeaders: (config) => {
    return {...config, headers: { 'x-ms-blob-type': 'BlockBlob' }};
  }
};
describe('AssetBrowserComponent', () => {
  let component: AssetBrowserComponent;
  let fixture: ComponentFixture<AssetBrowserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [InfiniteScrollModule, HttpClientTestingModule, FormsModule],
      declarations: [AssetBrowserComponent],
      providers: [{ provide: EditorService, useValue: mockEditorService }, QuestionService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'getAcceptType').and.callFake(() => {return ''});
    component.ngOnInit();
    expect(component.getAcceptType).toHaveBeenCalledWith(mockEditorService.editorConfig.config.assetConfig.image.accepted, 'image');
  });

  it("#getAcceptType should return accepted content types", () => {
    const typeList = "png, jpeg";
    const type = "image";
    spyOn(component, 'getAcceptType').and.callThrough();
    const result = component.getAcceptType(typeList, type);
    expect(result).toEqual("image/png,image/jpeg");
  });

  it('#initializeImagePicker() should set showImagePicker to true', () => {
    spyOn(component, 'initializeImagePicker').and.callThrough();
    component.initializeImagePicker();
    expect(component.showImagePicker).toBeTruthy();
  });

  it('#getMyImages() should return images on API success', async () => {
    const response = mockData.serverResponse;
    response.result = {
      count: 1,
      content: [{
        downloadUrl: '/test'
      }]
    }
    let questionService: QuestionService = TestBed.inject(QuestionService);
    spyOn(questionService, 'getAssetMedia').and.returnValue(of(response));
    const offset = 0;
    component.getMyImages(offset);
    expect(component.assetsCount).toEqual(1);
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
    spyOn(component.assetBrowserEmitter, 'emit').and.callFake(() => {});
    component.addImageInEditor(mockData.assetBrowserEvent.url, '12345');
    expect(component.assetBrowserEmitter.emit).toHaveBeenCalledWith(mockData.assetBrowserEvent);
  });

  it('#getAllImages() should return images on API success', async () => {
    const response = mockData.serverResponse;
    response.result = {
      count: 1,
      content: [{
        downloadUrl: '/test'
      }]
    }
    let questionService: QuestionService = TestBed.inject(QuestionService);
    spyOn(questionService, 'getAssetMedia').and.returnValue(of(response));
    const offset = 0;
    component.getAllImages(offset);
    spyOn(component.allImages, 'push');
    expect(component.assetsCount).toEqual(1);
  });
  it('#resetFormData() should reset the form data', () => {
    component.resetFormData();
    expect(component.imageUploadLoader).toEqual(false);
    expect(component.imageFormValid).toEqual(false);
    expect(component.formConfig).toBeTruthy();
  })
  it('#uploadAndUseImage should upload image on API success', async () => {
    const createMediaAssetResponse = mockData.serverResponse;
    createMediaAssetResponse.result = {
      node_id: 'do_123'
    }
    const preSignedResponse = mockData.serverResponse;
    preSignedResponse.result = {
      node_id: 'do_234',
      pre_signed_url: '/test'
    }
    let questionService: QuestionService = TestBed.inject(QuestionService);
    let modal = true;
    spyOn(questionService, 'createMediaAsset').and.returnValue(of(createMediaAssetResponse));
    spyOn(questionService, 'generatePreSignedUrl').and.returnValue(of(preSignedResponse));
    const editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'appendCloudStorageHeaders').and.callThrough();
    spyOn(component, 'addImageInEditor').and.callThrough();
    spyOn(component, 'dismissPops').and.callThrough();
    component.uploadAndUseImage(modal);
    expect(questionService.createMediaAsset).toHaveBeenCalled();
    expect(editorService.appendCloudStorageHeaders).toHaveBeenCalled();
    expect(component.loading).toEqual(true);
    expect(component.isClosable).toEqual(false);
    expect(component.imageFormValid).toEqual(false);
  });
  xit('#uploadAndUseImage should upload image and call upload to blob', async () => {
    const createMediaAssetResponse = mockData.serverResponse;
    createMediaAssetResponse.result = {
      node_id: 'do_123'
    }
    const preSignedResponse = mockData.serverResponse;
    preSignedResponse.result = {
      node_id: 'do_234',
      pre_signed_url: '/test?'
    }
    const uploadMediaResponse = mockData.serverResponse;
    uploadMediaResponse.result = {
      node_id: 'do_234',
      content_url: '/test'
    }
    component.showImageUploadModal = false;
    let questionService: QuestionService = TestBed.inject(QuestionService);
    let modal = true;
    spyOn(questionService, 'createMediaAsset').and.returnValue(of(createMediaAssetResponse));
    spyOn(questionService, 'generatePreSignedUrl').and.returnValue(of(preSignedResponse));
    spyOn(component, 'uploadToBlob').and.returnValue(of(true));
    spyOn(questionService, 'uploadMedia').and.returnValue(of(uploadMediaResponse));
    spyOn(component, 'addImageInEditor').and.callThrough();
    spyOn(component, 'dismissPops').and.callFake(()=> {});
    spyOn(component, 'uploadAndUseImage').and.callThrough();
    component.uploadAndUseImage(modal);
    expect(questionService.createMediaAsset).toHaveBeenCalled();
    expect(questionService.generatePreSignedUrl).toHaveBeenCalled();
    expect(component.uploadToBlob).toHaveBeenCalled();
  });
  it('#generateAssetCreateRequest() should return asset create request', () => {
    let fileName = 'test';
    let fileType = 'image/png';
    let mediaType = 'image';
    const result = component.generateAssetCreateRequest(fileName, fileType, mediaType);
    expect(result).toEqual({
      name: fileName,
      mediaType,
      mimeType: fileType,
      createdBy: _.get(mockEditorService.editorConfig, 'context.user.id'),
      creator: _.get(mockEditorService.editorConfig, 'context.user.fullName'),
      channel: _.get(mockEditorService.editorConfig, 'context.channel')
    })
  })

  it('#uploadToBlob() should upload blob on API success', () => {
    let signedURL = '/test';
    let file = new File([], 'filename');
    let config = {};
    let questionService: QuestionService= TestBed.inject(QuestionService);
    spyOn(questionService.http, 'put').and.returnValue(of({"responseCode": "OK"}));
    component.uploadToBlob(signedURL, file, config).subscribe(data => {
      expect(data.responseCode).toEqual('OK');
    })
  })

  xit('#dismissImageUploadModal() should set showImagePicker to true', () => {
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
    expect(component.getMyImages).toHaveBeenCalledWith(0, undefined, true);
  });
  it('#lazyloadMyImages() should get all images', () => {
    spyOn(component, 'getAllImages');
    component.lazyloadAllImages();
    expect(component.getAllImages).toHaveBeenCalledWith(0, undefined, true);
  });
  it('#uploadImage() should create asset on API success', () => {
    const file = new File([''], 'filename', { type: 'image' });
    const event = {
      target: {
        files: [
          file
        ]
      }
    }
    component.assetConfig = {
      "image": {
          "size": "1",
          "sizeType": "MB",
          "accepted": "png, jpeg"
        }
      }
    spyOn(component, 'generateAssetCreateRequest').and.returnValue({
        name: 'flower', mediaType: 'image',
        mimeType: 'image', createdBy: '12345',
        creator: 'n11', channel: '0110986543'
    })
    spyOn(component, 'populateFormData').and.callFake(() => {});
    spyOn(component, 'uploadImage').and.callThrough();
    component.uploadImage(event);
    expect(component.imageUploadLoader).toEqual(true);
    expect(component.imageFormValid).toEqual(true);
    expect(component.generateAssetCreateRequest).toHaveBeenCalled();
    expect(component.populateFormData).toHaveBeenCalled();
  })
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
  it('#searchImages() should call  getMyImages for my images', () => {
    spyOn(component, 'getMyImages');
    component.searchImages('clearInput', 'myImages');
    expect(component.query).toEqual('');
    expect(component.searchMyInput).toEqual('');
    expect(component.getMyImages).toHaveBeenCalledWith(0, '', true);
  });
  it('#searchImages() should call allImages for all images ', () => {
    spyOn(component, 'getAllImages');
    component.searchImages('clearInput', 'allImages');
    expect(component.query).toEqual('');
    expect(component.searchAllInput).toEqual('');
    expect(component.getAllImages).toHaveBeenCalledWith(0, '', true);
  });
  it('#ngOnInit() should call ngOnInit and define formConfig', () => {
    component.ngOnInit();
    expect(component.formConfig).toBeDefined();
  });
  it('#onStatusChanges() should call onStatusChanges and imageUploadLoader is false', () => {
    component.imageUploadLoader = false;
    const data = {
      controls: [],
      isDirty: true,
      isInvalid: false,
      isPristine: false,
      isValid: true
    };
    component.onStatusChanges(data);
    expect(component.imageFormValid).toBeFalsy();
  });
  it('#onStatusChanges() should call onStatusChanges and imageUploadLoader is true and is form valid false', () => {
    component.imageUploadLoader = true;
    const data = {
      controls: [],
      isDirty: true,
      isInvalid: false,
      isPristine: false,
      isValid: false
    };
    component.onStatusChanges(data);
    expect(component.imageFormValid).toBeFalsy();
  });
  it('#onStatusChanges() should call onStatusChanges and imageUploadLoader is true and is form valid true', () => {
    component.imageUploadLoader = true;
    const data = {
      controls: [],
      isDirty: true,
      isInvalid: false,
      isPristine: false,
      isValid: true
    };
    component.onStatusChanges(data);
    expect(component.imageFormValid).toBeTruthy();
  });
  it('#valueChanges() should define assestRequestBody ', () => {
    component.imageUploadLoader = true;
    component.assestData = mockData.formData;
    const data = {
      creator: 'Vaibahv Bhuva',
      keywords: undefined,
      name: 'logo'
    };
    component.valueChanges(data);
    expect(component.assestData).toBeDefined();
  });
  it('#openImageUploadModal() should reset upload image form  ', () => {
    component.openImageUploadModal();
    expect(component.imageUploadLoader).toBeFalsy();
    expect(component.imageFormValid).toBeFalsy();
    expect(component.showImageUploadModal).toBeTruthy();
    expect(component.formData).toBeNull();
  });
  it('#dismissPops() should close both pops  ', () => {
    spyOn(component, 'dismissImagePicker');
    const modal = {
      deny: jasmine.createSpy('deny')
    };
    component.dismissPops(modal);
    expect(component.dismissImagePicker).toHaveBeenCalled();
    expect(modal.deny).toHaveBeenCalled();
  });
  it('#dismissImagePicker() should emit modalDismissEmitter event  ', () => {
    spyOn(component, 'dismissImagePicker');
    component.dismissImagePicker();
    expect(component.dismissImagePicker).toHaveBeenCalled();
    expect(component.showImagePicker).toBeFalsy();
  });
});
