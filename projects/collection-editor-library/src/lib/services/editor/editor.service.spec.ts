import { editorConfig } from './../../components/editor/editor.component.spec.data';
import { TestBed } from '@angular/core/testing';
import { EditorService } from './editor.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { error } from '@angular/compiler/src/util';
import { PublicDataService } from '../public-data/public-data.service';

describe('EditorService', () => {
  let editorService: EditorService;
  const configServiceData = {
    labelConfig: {
      messages: {
        success: {
          '011': 'File downloaded'
        },
      }
    }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient, PublicDataService, { provide: ConfigService, useValue: configServiceData }]
    });
    editorService = TestBed.get(EditorService);
    editorService.initialize(editorConfig);
  });

  it('should be created', () => {
    const service: EditorService = TestBed.get(EditorService);
    expect(service).toBeTruthy();
  });
  it('#contentsCountAddedInLibraryPage() should increase value of contentsCount', () => {
    const service: EditorService = TestBed.get(EditorService);
    service.contentsCount = 0;
    service.contentsCountAddedInLibraryPage(undefined);
    expect(service.contentsCount).toBe(1);
  });
  it('#contentsCountAddedInLibraryPage() should set value of contentsCount to zero', () => {
    const service: EditorService = TestBed.get(EditorService);
    service.contentsCount = 2;
    service.contentsCountAddedInLibraryPage(true);
    expect(service.contentsCount).toBe(0);
  });
  it('#downloadBlobUrlFile() should download the file', () => {
    const service: EditorService = TestBed.get(EditorService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'success').and.callThrough();
    spyOn(URL, 'createObjectURL').and.callFake((data) => { });
    const http = TestBed.get(HttpClient);
    spyOn(http, 'get').and.returnValue(of({ test: 'ok' }));
    const downloadConfig = {
      // tslint:disable-next-line:max-line-length
      blobUrl: 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/textbook/toc/do_113312173590659072160_dev-testing-1_1625022971409.csv',
      successMessage: 'File downloaded',
      fileType: 'csv',
      fileName: 'do_113312173590659072160'
    };
    service.downloadBlobUrlFile(downloadConfig);
    expect(http.get).toHaveBeenCalled();
    expect(http.get).toHaveBeenCalledTimes(1);
    expect(http.get).toHaveBeenCalledWith(downloadConfig.blobUrl, { responseType: 'blob' });
    expect(toasterService.success).toHaveBeenCalledWith(configServiceData.labelConfig.messages.success['011']);
  });
  it('#downloadHierarchyCsv() should downloadHierarchyCsv', async () => {
    const publicDataService: PublicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(of({
      'id': 'api.collection.export',
      'ver': '4.0',
      'ts': '2021-07-05T07:43:10ZZ',
      'params': {
        'resmsgid': 'd54936f9-9f9a-449a-a797-5564d5a97c6c',
        'msgid': null,
        'err': null,
        'status': 'successful',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'collection': {
          // tslint:disable-next-line:max-line-length
          'tocUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/textbook/toc/do_113312173590659072160_dev-testing-1_1625022971409.csv',
          'ttl': '54000'
        }
      }
    }));
    editorService.downloadHierarchyCsv('do_113312173590659072160').subscribe(data => {
      expect(data.responseCode).toBe('OK');
    });
  });
  it('#validateCSVFile() should validateCSVFile', async () => {
    const publicDataService: PublicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(of({
      'id': 'api.collection.import',
      'ver': '4.0',
      'ts': '2021-07-05T08:28:06ZZ',
      'params': {
        'resmsgid': 'f151855b-98fd-4baf-b8dc-00c31cc47b71',
        'msgid': null,
        'err': 'INVALID_CSV_FILE',
        'status': 'failed',
        'errmsg': 'Please provide valid csv file. Please check for data columns without headers.'
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {
        'messages': null
      }
    }));
    editorService.validateCSVFile(null, 'do_113312173590659072160').subscribe(data => {
    },
      error => {
        expect(error.error.responseCode).toBe('CLIENT_ERROR');

      });
  });
});
