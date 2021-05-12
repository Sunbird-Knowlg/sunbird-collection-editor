import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash-es';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { EditorService } from '../../services/editor/editor.service';
import { QuestionService } from '../../services/question/question.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import {config} from './asset-browser.data';
@Component({
  selector: 'lib-asset-browser',
  templateUrl: './asset-browser.component.html',
  styleUrls: ['./asset-browser.component.scss']
})
export class AssetBrowserComponent implements OnInit, OnDestroy {
  @Input() showImagePicker;
  @Output() assetBrowserEmitter = new EventEmitter<any>();
  @Output() modalDismissEmitter = new EventEmitter<any>();
  @ViewChild('modal', { static: false }) private modal;
  constructor(private editorService: EditorService,
              private questionService: QuestionService, private toasterService: ToasterService) { }
  assetConfig: any = {
    image: {
      size: '1',
      accepted: 'png, jpeg'
    }
  };
  myAssets = [];
  allImages = [];
  public imageUploadLoader = false;
  showImageUploadModal: boolean;
  acceptImageType: any;
  showErrorMsg: boolean;
  errorMsg: string;
  query: string;
  uploader;
  isClosable = true;
  loading = false;
  public mediaobj;
  public assetProxyUrl = '/assets/public/';
  public editorInstance: any;
  public assetsCount: any;
  public searchMyInput = '';
  public searchAllInput: any;
  showAddButton: boolean;
  appIcon;
  public formData: any;
  public assestData = {};
  public formConfig: any;
  public initialFormConfig: any;
  public imageFormValid: any;
  ngOnInit() {
    this.initialFormConfig =  _.get(config, 'uploadIconFormConfig');
    this.formConfig =  _.get(config, 'uploadIconFormConfig');
    this.acceptImageType = this.getAcceptType(this.assetConfig.image.accepted, 'image');
  }

  getAcceptType(typeList, type) {
    const acceptTypeList = typeList.split(', ');
    const result = [];
    _.forEach(acceptTypeList, (content) => {
      result.push(`${type}/${content}`);
    });
    return result.toString();
  }

  initializeImagePicker() {
    this.showImagePicker = true;
  }

  outputEventHandler(event) {
    console.log(JSON.stringify(event));
  }

  getMyImages(offset, query?, search?) {
    this.assetsCount = 0;
    if (!search) {
      this.searchMyInput = '';
    }
    if (offset === 0) {
      this.myAssets.length = 0;
    }
    const req = {
      filters: {
        mediaType: ['image'],
        createdBy: _.get(this.editorService.editorConfig, 'context.user.id')
      },
      offset
    };
    if (query) {
      req['query'] = query;
    }
    this.questionService.getAssetMedia(req).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Image search failed' };
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    })).subscribe((res) => {
        this.assetsCount = res.result.count;
        _.map(res.result.content, (item) => {
          if (item.downloadUrl) {
            this.myAssets.push(item);
          }
        });
      });
  }

  addImageInEditor(imageUrl, imageId) {
    this.appIcon = imageUrl;
    this.showImagePicker = false;
    this.assetBrowserEmitter.emit({type: 'image', url: this.appIcon});
  }

  getAllImages(offset, query?, search?) {
    this.assetsCount = 0;
    if (!search) {
      this.searchAllInput = '';
    }
    if (offset === 0) {
      this.allImages.length = 0;
    }
    const req = {
      filters: {
        mediaType: ['image']
      },
      offset
    };
    if (query) {
      req['query'] = query;
    }
    this.questionService.getAssetMedia(req).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Image search failed' };
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    }))
      .subscribe((res) => {
        this.assetsCount = res.result.count;
        _.map(res.result.content, (item) => {
          if (item.downloadUrl) {
            this.allImages.push(item);
          }
        });
      });
  }

  lazyloadMyImages() {
    const offset = this.myAssets.length;
    this.getMyImages(offset, this.query, true);
  }

  /**
   * function to lazy load all images
   */
  lazyloadAllImages() {
    const offset = this.allImages.length;
    this.getAllImages(offset, this.query, true);
  }
  uploadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    this.formData = new FormData();
    this.formData.append('file', file);
    const fileType = file.type;
    const fileName = file.name.split('.').slice(0, -1).join('.');
    const fileSize = file.size / 1024 / 1024;
    if (fileType.split('/')[0] === 'image') {
      this.showErrorMsg = false;
      if (fileSize > this.assetConfig.image.size) {
        this.showErrorMsg = true;
        this.errorMsg = 'Max size allowed is ' + this.assetConfig.image.size + 'MB';
      } else {
        this.errorMsg = '';
        this.showErrorMsg = false;
        reader.readAsDataURL(file);
      }
    } else {
      this.showErrorMsg = true;
      this.errorMsg = 'Please choose an image file';
    }
    if (!this.showErrorMsg) {
      this.imageUploadLoader = true;
      this.imageFormValid = true;
      this.assestData = this.generateAssetCreateRequest(fileName, fileType, 'image');
      this.populateFormData(this.assestData);
    }
  }
  populateFormData(formData) {
    const formvalue = _.cloneDeep(this.formConfig);
    this.formConfig = null;
    _.forEach(formvalue, (formFieldCategory) => {
        formFieldCategory.default = formData[formFieldCategory.code];
    });
    this.formConfig = formvalue;
  }
  uploadAndUseImage() {
    if (!this.imageFormValid) {
      this.toasterService.error('Please fill required fields');
      return ;
    }
    this.questionService.createMediaAsset({ content: this.assestData }).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Image upload failed' };
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    })).subscribe((res) => {
      const imgId = res.result.node_id;
      const request = {
        data: this.formData
      };
      this.questionService.uploadMedia(request, imgId).pipe(catchError(err => {
        const errInfo = { errorMsg: 'Image upload failed' };
        return throwError(this.editorService.apiErrorHandling(err, errInfo));
      })).subscribe((response) => {
        this.addImageInEditor(response.result.content_url, response.result.node_id);
        this.showImagePicker = false;
        this.showImageUploadModal = false;
      });
    });
  }
  generateAssetCreateRequest(fileName, fileType, mediaType) {
    return {
        name: fileName,
        mediaType,
        mimeType: fileType,
        createdBy: _.get(this.editorService.editorConfig, 'context.user.id'),
        creator: _.get(this.editorService.editorConfig, 'context.user.fullName'),
        channel: _.get(this.editorService.editorConfig, 'context.channel')
    };
  }

  uploadToBlob(signedURL, file, config): Observable<any> {
    return this.questionService.http.put(signedURL, file, config).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Unable to upload to Blob and Content Creation Failed, Please Try Again' };
      this.isClosable = true;
      this.loading = false;
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    }), map(data => data));
  }


  dismissImageUploadModal() {
    this.showImagePicker = true;
    this.showImageUploadModal = false;
  }
  openImageUploadModal() {
    this.showImageUploadModal = true;
    this.formData = null;
    this.formConfig = this.initialFormConfig;
    this.imageUploadLoader = false;
    this.imageFormValid = false;
  }
  dismissPops(modal) {
    this.dismissImagePicker();
    modal.deny();
  }
  dismissImagePicker() {
    this.showImagePicker = false;
    this.modalDismissEmitter.emit({})
  }
  searchImages(event, type) {
    if (event === 'clearInput' && type === 'myImages') {
      this.query = '';
      this.searchMyInput = '';
    } else if (event === 'clearInput' && type === 'allImages') {
      this.query = '';
      this.searchAllInput = '';
    } else {
      this.query = event.target.value;
    }
    if (type === 'myImages' ) {
        this.getMyImages(0, this.query, true);
    } else {
        this.getAllImages(0, this.query, true);
    }
  }
  onStatusChanges(event) {
    if (event.isValid && this.imageUploadLoader) {
      this.imageFormValid = true;
    } else {
      this.imageFormValid = false;
    }
  }
  valueChanges(event) {
    this.assestData = _.merge({}, this.assestData, event);
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }

}
