import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash-es';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { EditorService } from '../../services/editor/editor.service';
import { QuestionService } from '../../services/question/question.service';
import {config} from './asset-browser.data';
import { ConfigService } from '../../services/config/config.service';
declare const SunbirdFileUploadLib: any;

@Component({
  selector: 'lib-asset-browser',
  templateUrl: './asset-browser.component.html',
  styleUrls: ['./asset-browser.component.scss']
})
export class AssetBrowserComponent implements OnInit, OnDestroy {
  @Input() showImagePicker;
  @Output() assetBrowserEmitter = new EventEmitter<any>();
  @Output() modalDismissEmitter = new EventEmitter<any>();
  @ViewChild('modal') private modal;
  constructor(private editorService: EditorService, public configService: ConfigService,
              private questionService: QuestionService) { }
  assetConfig: any = {};
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
  public termsAndCondition: any;
  public assetName: any;
  public emptySearchMessage: any;
  public imageFile: any;
  ngOnInit() {
    this.initialFormConfig =  _.get(config, 'uploadIconFormConfig');
    this.formConfig =  _.get(config, 'uploadIconFormConfig');
    this.assetConfig = this.editorService.editorConfig.config.assetConfig;
    this.termsAndCondition =  _.get(this.configService.labelConfig, 'termsAndConditions.001');
    this.emptySearchMessage =  _.get(this.configService.labelConfig, 'messages.error.016');
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
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.022') };
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
      const errInfo = { errorMsg:  _.get(this.configService.labelConfig, 'messages.error.022')};
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
    this.imageFile = event.target.files[0];
    const file = event.target.files[0];
    const reader = new FileReader();
    this.formData = new FormData();
    this.formData.append('file', file);
    this.assetName = file.name;
    const fileType = file.type;
    const fileName = file.name.split('.').slice(0, -1).join('.');
    const fileSize = file.size / 1024 / 1024;
    if (fileType.split('/')[0] === 'image') {
      this.showErrorMsg = false;
      if (fileSize > this.assetConfig.image.size) {
        this.showErrorMsg = true;
        this.errorMsg =  _.get(this.configService.labelConfig, 'messages.error.021') +
        this.assetConfig.image.size + this.assetConfig.image.sizeType;
        this.resetFormData();
      } else {
        this.errorMsg = '';
        this.showErrorMsg = false;
        reader.readAsDataURL(file);
      }
    } else {
      this.showErrorMsg = true;
      this.errorMsg = _.get(this.configService.labelConfig, 'messages.error.020');
    }
    if (!this.showErrorMsg) {
      this.imageUploadLoader = true;
      this.imageFormValid = true;
      this.assestData = this.generateAssetCreateRequest(fileName, fileType, 'image');
      this.populateFormData(this.assestData);
    }
  }
  resetFormData() {
    this.imageUploadLoader = false;
    this.imageFormValid = false;
    this.formConfig = this.initialFormConfig;
  }
  populateFormData(formData) {
    const formvalue = _.cloneDeep(this.formConfig);
    this.formConfig = null;
    _.forEach(formvalue, (formFieldCategory) => {
        formFieldCategory.default = formData[formFieldCategory.code];
        formFieldCategory.editable = true;
    });
    this.formConfig = formvalue;
  }
  uploadAndUseImage(modal) {
    this.isClosable = false;
    this.loading = true;
    this.showErrorMsg = false;
    this.imageFormValid = false;
    this.questionService.createMediaAsset({ asset: this.assestData }).pipe(catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.019') };
      this.loading = false;
      this.isClosable = true;
      this.imageFormValid = true;
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    })).subscribe((res) => {
      const imgId = res.result.node_id;
      const preSignedRequest = {
        content: {
          fileName: this.assetName
        }
      };
      this.questionService.generatePreSignedUrl(preSignedRequest, imgId).pipe(catchError(err => {
        const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.026') };
        this.loading = false;
        this.isClosable = true;
        this.imageFormValid = true;
        return throwError(this.editorService.apiErrorHandling(err, errInfo));
      })).subscribe((response) => {
        const signedURL = response.result.pre_signed_url;
        let blobConfig = {
          processData: false,
          contentType: 'Asset'
        };
        blobConfig = this.editorService.appendCloudStorageHeaders(blobConfig);
        this.uploadToBlob(signedURL, this.imageFile, blobConfig).subscribe(() => {
          const fileURL = signedURL.split('?')[0];
          const data = new FormData();
          data.append('fileUrl', fileURL);
          data.append('mimeType', _.get(this.imageFile, 'type'));
          const config1 = {
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            cache: false
          };
          const uploadMediaConfig = {
            data,
            param: config1
          };
          this.questionService.uploadMedia(uploadMediaConfig, imgId).pipe(catchError(err => {
            const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.019') };
            this.isClosable = true;
            this.loading = false;
            this.imageFormValid = true;
            return throwError(this.editorService.apiErrorHandling(err, errInfo));
          })).subscribe((response1) => {
            this.addImageInEditor(response1.result.content_url, response1.result.node_id);
            this.showImageUploadModal = false;
            this.dismissPops(modal);
          });
        });
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
    const csp = _.get(this.editorService.editorConfig, 'context.cloudStorage.provider', 'azure');
    return new Observable((observer) => {
      const uploaderLib = new SunbirdFileUploadLib.FileUploader();
      uploaderLib.upload({ url: signedURL, file, csp })
      .on("error", (error) => {
        const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.018') };
        this.isClosable = true;
        this.loading = false;
        observer.error(this.editorService.apiErrorHandling(error, errInfo));
      }).on("completed", (completed) => {
        observer.next(completed);
        observer.complete();
      })
    });
  }


  dismissImageUploadModal() {
    if (this.isClosable) {
    this.showImagePicker = true;
    this.showImageUploadModal = false;
    }
  }
  openImageUploadModal() {
    this.showImageUploadModal = true;
    this.formData = null;
    this.formConfig = this.initialFormConfig;
    this.imageUploadLoader = false;
    this.imageFormValid = false;
    this.showErrorMsg = false;
    this.loading = false;
    this.isClosable = true;
  }
  dismissPops(modal) {
    this.dismissImagePicker();
    if (modal && modal.deny) {
      modal.deny();
    }
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
