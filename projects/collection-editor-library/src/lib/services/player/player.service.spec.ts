import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { EditorService } from './../../services/editor/editor.service';
import { ConfigService } from '../../services/config/config.service';
import * as urlConfig from '../../services/config/url.config.json';
import * as labelConfig from '../../services/config/label.config.json';
import * as categoryConfig from '../../services/config/category.config.json';

const configStub = {
  urlConFig: (urlConfig as any).default,
  labelConfig: (labelConfig as any).default,
  categoryConfig: (categoryConfig as any).default,
  playerConfig: {
    playerConfig: {
      context: {
        contentId: '',
        sid: '',
        uid: '',
        timeDiff: '',
        contextRollup: '',
        channel: '',
        did: '',
        pdata: {
          ver: ''
        },
        dims: '',
        tags: {},
        app: {},
        cdata: ''
      },
      metadata: {},
      data: {},
      config: {
        enableTelemetryValidation: false,
        previewCdnUrl: ''
      }
    },
    MIME_TYPE: {
      ecmlContent: {}
    }
  }
};

const mockEditorService = {
  editorConfig: {
    context: {
      sid: '123',
      uid: '1234',
      timeDiff: '',
      contextRollup: '',
      channel: 'sunbird',
      did: '123',
      mode: '',
      metadata: {},
      data: {},
      user: {
        firstName: 'Amol',
        lastName: 'G'
      }
    },
    config: {
    }
  }
};

describe('PlayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient,
        { provide: EditorService, useValue: mockEditorService },
        { provide: ConfigService, useValue: configStub }]
    });
  });

  it('should be created', () => {
    const service: PlayerService = TestBed.get(PlayerService);
    expect(service).toBeTruthy();
  });

  it('#getQumlPlayerConfig() should return QUML player config', () => {
    const service: PlayerService = TestBed.get(PlayerService);
    const result = service.getQumlPlayerConfig();
    expect(result.context.userData).toBeTruthy();
    expect(result.config).toBeTruthy();
    expect(result.context.mode).toEqual('play');
    expect(result.metadata).toBeTruthy();
    expect(result.data).toBeTruthy();
  })

  it('#getPlayerConfig() should return player config', () => {
    const service: PlayerService = TestBed.get(PlayerService);
    const contentDetails = {
      contentId: 'do_123',
      courseId: 'do_1234',
      batchId: 'do_12345',
      contentData: {},
      body: {},
      mimeType: 'image/png'
    };
    const result = service.getPlayerConfig(contentDetails);
    expect(result).toBeTruthy();
  })
});
