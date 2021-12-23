import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvUploadComponent } from './csv-upload.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfigService } from '../../services/config/config.service';
import { of, throwError } from 'rxjs';
import * as urlConfig from '../../services/config/url.config.json';
import * as labelConfig from '../../services/config/label.config.json';
import * as categoryConfig from '../../services/config/category.config.json';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { EditorService } from './../../services/editor/editor.service';
import {csvImport, preSignedUrl} from './csv-upload.component.spec.data';
describe('CsvUploadComponent', () => {
  let component: CsvUploadComponent;
  let fixture: ComponentFixture<CsvUploadComponent>;
  const configStub = {
    urlConFig: (urlConfig as any).default,
    labelConfig: (labelConfig as any).default,
    categoryConfig: (categoryConfig as any).default
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CsvUploadComponent, TelemetryInteractDirective],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [EditorTelemetryService, EditorService, { provide: ConfigService, useValue: configStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvUploadComponent);
    component = fixture.componentInstance;
  });

  it('should create CsvUploadComponent', () => {
    expect(component).toBeTruthy();
  });
  it('#ngOnInit should call handleInputCondition', () => {
    spyOn(component, 'handleInputCondition');
    component.ngOnInit();
    expect(component.handleInputCondition).toHaveBeenCalled();
  });
  it('#handleInputCondition should set pop up conditions', () => {
    component.isCreateCsv = true;
    component.handleInputCondition();
    expect(component.uploadCSVFile).toBeTruthy();
    expect(component.sampleCsvUrl).toBeDefined();
  });
  it('#handleInputCondition should set pop up conditions', () => {
    component.isCreateCsv = false;
    component.handleInputCondition();
    expect(component.updateCSVFile).toBeTruthy();
  });
  it('#uploadCSV() should upload file for defined value', () => {
    const file = {lastModified: 1625731160551,
        lastModifiedDate: 'Thu Jul 08 2021 13:29:20 GMT+0530 (India Standard Time)',
        name: "Blank.csv",
        size: 773,
        type: "text/csv",
        webkitRelativePath: '' };
    const event = {
      target: {
        files: [
          file
        ]
      }
    };
    component.uploadCSV(event);
    expect(component.isUploadCsvEnable).toBeTruthy();
    expect(component.file).toBeDefined();
    expect(component.fileName).toBeDefined();
  });
  it('#uploadCSV() should upload file for undefined value', () => {
    component.isUploadCsvEnable = true;
    const event = {};
    component.uploadCSV(event);
    expect(component.isUploadCsvEnable).toBeFalsy();
    expect(component.file).toBeUndefined();
    expect(component.fileName).toBeUndefined();
  });
  it('#closeHierarchyModal should close popup', () => {
    spyOn(component.csvUploadEmitter, 'emit');
    spyOn(component, 'resetConditions');
    const modal = {
      deny: jasmine.createSpy('deny')
    };
    component.isCreateCsv = false;
    component.closeHierarchyModal(modal);
    expect(component.uploadCSVFile).toBeFalsy();
    expect(component.updateCSVFile).toBeFalsy();
    expect(component.csvUploadEmitter.emit).toHaveBeenCalledWith({ status: true, type: 'closeModal' });
    expect(modal.deny).toHaveBeenCalled();
    expect(component.resetConditions).toHaveBeenCalled();
  });
  it('#onClickReupload should show updateCSVFile screen', () => {
    component.isCreateCsv = false;
    spyOn(component, 'resetConditions');
    component.onClickReupload();
    expect(component.updateCSVFile).toBeTruthy();
    expect(component.showCsvValidationStatus).toBeFalsy();
    expect(component.resetConditions).toHaveBeenCalled();
  });
  it('#onClickReupload should show uploadCSVFile screen', () => {
    component.isCreateCsv = true;
    spyOn(component, 'resetConditions');
    component.onClickReupload();
    expect(component.uploadCSVFile).toBeTruthy();
    expect(component.showCsvValidationStatus).toBeFalsy();
    expect(component.resetConditions).toHaveBeenCalled();
  });
  it('#resetConditionns should reset variables', () => {
    component.resetConditions();
    expect(component.errorCsvStatus).toBeFalsy();
    expect(component.isUploadCsvEnable).toBeFalsy();
    expect(component.file).toBeNull();
    expect(component.errorCsvMessage).toBe('');
  });
  it('#downloadSampleCSVFile() should download the file', () => {
    component.collectionId = 'do_113274017771085824116';
    // tslint:disable-next-line:max-line-length
    component.sampleCsvUrl = 'https://sunbirddev.blob.core.windows.net/sourcing/collection-hierarchy/create-collection-hierarchy.csv';
    const config = {
      blobUrl: component.sampleCsvUrl,
      successMessage: false,
      fileType: 'csv',
      fileName: component.collectionId
    };
    const editorService = TestBed.get(EditorService);
    //spyOn(editorService, 'downloadBlobUrlFile').and.callThrough();
    component.downloadSampleCSVFile();
    //expect(editorService.downloadBlobUrlFile).toHaveBeenCalledWith(config);
  });
  it('#updateContentWithURL() should call updateContentWithURL and check csv file for error case', () => {
    component.collectionId = 'do_113274017771085824116';
    const data = new FormData();
    data.append('fileUrl', csvImport.fileUrl);
    data.append('mimeType', 'text/csv');
    const config = {
      enctype: 'multipart/form-data',
      processData: false,
      contentType: false,
      cache: false
    };
    const option = {
      data,
      param: config
    };
    // tslint:disable-next-line:no-string-literal
    spyOn(component['editorService'], 'validateCSVFile').and.returnValue(throwError({error: csvImport.importError}));
    component.uploadCSVFile = false;
    component.isUploadCsvEnable = true;
    component.isClosable = false;
    component.updateContentWithURL(csvImport.fileUrl, 'text/csv', component.collectionId);
    expect(component.showCsvValidationStatus).toBeFalsy();
    expect(component.errorCsvStatus).toBeTruthy();
    expect(component.isClosable).toBeTruthy();
  });
  it('#uploadToBlob should get pre signed url for success case', () => {
    // tslint:disable-next-line:no-string-literal
    spyOn(component['editorService'].httpClient, 'put').and.returnValue(of({}));
    component.uploadToBlob('sampleSigned.url', 'file', 'config');
    // tslint:disable-next-line:no-string-literal
    expect(component['editorService'].httpClient.put).toHaveBeenCalledWith('sampleSigned.url', 'file', 'config');
  });
  it('#uploadToBlob should get pre signed url for error case', async () => {
    component.configService.labelConfig = {messages: {error: {
      '018': 'error'
    }}};
    component.collectionId = 'do_113312173590659072160';
    // tslint:disable-next-line:no-string-literal
    spyOn(component['editorService'], 'apiErrorHandling').and.callThrough();
    // tslint:disable-next-line:no-string-literal
    spyOn(component['editorService'].httpClient, 'put').and.returnValue(throwError({error: preSignedUrl.error}));
    // tslint:disable-next-line:max-line-length
    const signedUrl = 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/hierarchy/do_1133209415529676801189/10_correct_file_format.csv?sv=2017-04-17&se=2021-07-13T04%3A57%3A02Z&sr=b&sp=w&sig=j0IG63JtWdoKTdsz151d9XKvrTTvwWTLW3JJqlXby6c%3D';
    component.uploadToBlob(signedUrl, 'file', 'config');
    // tslint:disable-next-line:no-string-literal
    expect(component['editorService'].httpClient.put).toHaveBeenCalledWith(signedUrl, 'file', 'config');
  });
  it('#validateCSVFile should call validateCSVFile success case', () => {
    component.collectionId = 'do_113312173590659072160';
    component.fileName = 'samplefile';
    component.file = {type: 'csv/text'};
    spyOn(component, 'uploadToBlob').and.returnValue(of({}));
    spyOn(component, 'updateContentWithURL');
    // tslint:disable-next-line:no-string-literal
    spyOn(component['editorService'], 'generatePreSignedUrl').and.returnValue(of(preSignedUrl.succes));
    // tslint:disable-next-line:no-string-literal
    spyOn(component['editorService'], 'apiErrorHandling').and.callThrough();
    component.validateCSVFile();
    expect(component.uploadToBlob).toHaveBeenCalled();
    expect(component.updateContentWithURL).toHaveBeenCalled();
  });
  xit('#validateCSVFile should call validateCSVFile for error case', () => {
    component.configService.labelConfig = {messages: {error: {
      '026': 'error'
    }}};
    component.collectionId = 'do_113312173590659072160';
    component.fileName = 'samplefile';
    component.file = {type: 'csv/text'};
    spyOn(component, 'uploadToBlob').and.returnValue(of({}));
    spyOn(component, 'updateContentWithURL');
    // tslint:disable-next-line:no-string-literal
    spyOn(component['editorService'], 'generatePreSignedUrl').and.returnValue(throwError({error: preSignedUrl.error}));
    // tslint:disable-next-line:no-string-literal
    spyOn(component['editorService'], 'apiErrorHandling').and.callThrough();
    component.validateCSVFile();
    expect(component.isClosable).toBeTruthy();
    expect(component.errorCsvStatus).toBeTruthy();
    expect(component.showCsvValidationStatus).toBeFalsy();
    expect(component.errorCsvMessage).toBeDefined();
  });
});
