import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash-es';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { EditorService } from '../../services/editor/editor.service';
import { QuestionService } from '../../services/question/question.service';

@Component({
  selector: 'lib-asset-browser',
  templateUrl: './asset-browser.component.html',
  styleUrls: ['./asset-browser.component.scss']
})
export class AssetBrowserComponent implements OnInit, OnDestroy {
  @Input() showImagePicker;
  @Output() assetBrowserEmitter = new EventEmitter<any>();
  @Output() modalDismissEmitter = new EventEmitter<any>();
  @ViewChild('modal', {static: false}) public modal;
  constructor(private editorService: EditorService,
              private questionService: QuestionService) { }
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
  showAddButton: boolean;
  appIcon;

  ngOnInit() {
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

  getMyImages(offset) {
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

    this.questionService.getAssetMedia(req).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Image search failed' };
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    })).subscribe((res) => {
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

  getAllImages(offset) {
    if (offset === 0) {
      this.allImages.length = 0;
    }
    const req = {
      filters: {
        mediaType: ['image']
      },
      offset
    };

    this.questionService.getAssetMedia(req).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Image search failed' };
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    }))
      .subscribe((res) => {
        _.map(res.result.content, (item) => {
          if (item.downloadUrl) {
            this.allImages.push(item);
          }
        });
      });
  }

  lazyloadMyImages() {
    const offset = this.myAssets.length;
    this.getMyImages(offset);
  }

  /**
   * function to lazy load all images
   */
  lazyloadAllImages() {
    const offset = this.allImages.length;
    this.getAllImages(offset);
  }

  uploadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const formData: FormData = new FormData();
    formData.append('file', file);
    const fileType = file.type;
    const fileName = file.name;
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
      // reader.onload = (uploadEvent: any) => {
      const req = this.generateAssetCreateRequest(fileName, fileType, 'image');
      this.questionService.createMediaAsset(req).pipe(catchError(err => {
          this.imageUploadLoader = false;
          const errInfo = { errorMsg: 'Image upload failed' };
          return throwError(this.editorService.apiErrorHandling(err, errInfo));
        })).subscribe((res) => {
          const imgId = res.result.node_id;
          const request = {
            data: formData
          };
          this.questionService.uploadMedia(request, imgId).pipe(catchError(err => {
            this.imageUploadLoader = false;
            const errInfo = { errorMsg: 'Image upload failed' };
            return throwError(this.editorService.apiErrorHandling(err, errInfo));
          })).subscribe((response) => {
            this.imageUploadLoader = false;
            this.addImageInEditor(response.result.content_url, response.result.node_id);
            this.showImagePicker = false;
            this.showImageUploadModal = false;
          });
      });
      reader.onerror = (error: any) => { };
    }
  }

  generateAssetCreateRequest(fileName, fileType, mediaType) {
    return {
      content: {
        name: fileName,
        mediaType,
        mimeType: fileType,
        createdBy: _.get(this.editorService.editorConfig, 'context.user.id'),
        creator: _.get(this.editorService.editorConfig, 'context.user.fullName'),
        channel: _.get(this.editorService.editorConfig, 'context.channel')
      }
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

  getMediaOriginURL(src) {
    const replaceText = this.assetProxyUrl;
    const cloudStorageUrls = _.get(this.editorService.editorConfig, 'context.cloudStorageUrls') || [];
    _.forEach(cloudStorageUrls, url => {
      if (src.indexOf(url) !== -1) {
        src = src.replace(url, replaceText);
      }
    });
    return src;
  }

  dismissImageUploadModal() {
    this.showImagePicker = true;
    this.showImageUploadModal = false;
  }

  dismissImagePicker() {
    this.showImagePicker = false;
    this.modalDismissEmitter.emit({})
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }

}