import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkUploadComponent } from './bulk-upload.component';
import { ToasterService } from '../../services/toaster/toaster.service';
import { EditorService } from '../../services/editor/editor.service';
import { ConfigService } from '../../services/config/config.service';
import { BulkJobService } from '../../services/bulk-job/bulk-job.service';
import { TreeService } from '../../services/tree/tree.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
declare const SunbirdFileUploadLib: any;
xdescribe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [BulkUploadComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [],
    providers: [ToasterService, EditorService, ConfigService,
        BulkJobService, TreeService, EditorTelemetryService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call closeBulkUploadModal', () => {
    component.closeBulkUploadModal();
    expect(component.showBulkUploadModal).toBeFalsy();
    expect(component.bulkUploadState).toBe(0);
  });
  it('should call downloadSampleCSVFile', () => {
    spyOn(window, 'open').and.callThrough();
    component.sampleMetadataCsvUrl = 'https://dockstorage.blob.core.windows.net/content-service/bulk-question-upload-sample-format.csv';
    const downloadConfig = {
      blobUrl: component.sampleMetadataCsvUrl,
      successMessage: false,
      fileType: 'csv',
      fileName: 'do_11339645670870220811360'
    };
    component.downloadSampleCSVFile();
    expect(window.open).toHaveBeenCalledWith(downloadConfig.blobUrl, '_blank');
  });
  xit('should call updateBulkUploadState for state 6', () => {
    component.bulkUploadState = 6;
    spyOn(component, 'closeBulkUploadModal').and.callThrough();
    component.updateBulkUploadState('increment');
    expect(component.closeBulkUploadModal).toHaveBeenCalled();
  });
  xit('should call updateBulkUploadState for state other than 4', () => {
    component.bulkUploadState = 1;
    spyOn(component, 'initiateDocumentUploadModal').and.callThrough();
    component.updateBulkUploadState('increment');
    expect(component.initiateDocumentUploadModal).toHaveBeenCalled();
  });

  it('#uploadToBlob should upload file to blob and return URL', () => {
    const editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'appendCloudStorageHeaders').and.callFake((config) => {
      return {...config, headers: { 'x-ms-blob-type': 'BlockBlob' }}
    });
    spyOn(editorService.httpClient, 'put').and.returnValue(of({}));
    const pre_signed_url = 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/assets/do_11359481407042355211/test.pdf?X-Amz';
    const resultSub = component.uploadToBlob(pre_signed_url, {});
    resultSub.subscribe((data) => {
      expect(data).toEqual('https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/assets/do_11359481407042355211/test.pdf');
      expect(editorService.appendCloudStorageHeaders).toHaveBeenCalled();
    })
  });

});
