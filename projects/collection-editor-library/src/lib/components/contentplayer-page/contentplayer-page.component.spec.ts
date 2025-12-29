import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ContentplayerPageComponent } from './contentplayer-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditorService } from '../../services/editor/editor.service';
import { PlayerService } from '../../services/player/player.service';
import { ConfigService } from '../../services/config/config.service';
import { of } from 'rxjs';
import * as _ from 'lodash-es';

describe('ContentplayerPageComponent', () => {
  let component: ContentplayerPageComponent;
  let fixture: ComponentFixture<ContentplayerPageComponent>;
  const contentMetadata = {
    data: {
      metadata: {
        identifier: 'do_123',
        mimeType: 'application/pdf'
      }
    }
  };

  const configMockData = {
    playerConfig: {
      playerType: {
        'pdf-player': [
           'application/pdf'
        ],
        'video-player': [
           'video/mp4',
           'video/webm'
        ]
     },
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ ContentplayerPageComponent ],
      providers: [EditorService, PlayerService, { provide: ConfigService, useValue: configMockData}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentplayerPageComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnChanges() should not call #getContentDetails method', () => {
    spyOn(component, 'getContentDetails').and.callThrough();
    component.contentMetadata = contentMetadata;
    component.contentId = 'do_123';
    component.ngOnChanges();
    expect(component.contentId).toEqual('do_123');
    expect(component.getContentDetails).not.toHaveBeenCalled();
  });

  it('#ngOnChanges() should call #getContentDetails method', () => {
    spyOn(component, 'getContentDetails').and.callThrough();
    component.contentMetadata = contentMetadata;
    component.contentId = 'do_1234';
    component.ngOnChanges();
    expect(component.contentId).toEqual('do_123');
    expect(component.getContentDetails).toHaveBeenCalled();
  });

  it('#getContentDetails should fetch content details when API success', () => {
    const response = {
      id: '',
        params: {
          resmsgid: '',
          msgid: '',
          err: '',
          status: '',
          errmsg: ''
        },
        responseCode: '200',
        result: { content: { name: 'test' }},
        ts: '',
        ver: '',
        headers: {}
    }
    const editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'fetchContentDetails').and.returnValue(of(response));
    const playerService = TestBed.inject(PlayerService);
    spyOn(playerService, 'getPlayerConfig').and.returnValue({config: {}, context: {}, data: {}, metadata: {}});
    spyOn(component, 'setPlayerType').and.callThrough();
    spyOn(component, 'loadDefaultPlayer').and.callFake(() => {});
    component.contentId = 'do_1234';
    component.getContentDetails();
    expect(component.setPlayerType).toHaveBeenCalled();
    expect(component.loadDefaultPlayer).toHaveBeenCalled();
  });

  it('#setPlayerType() should set #playerType to "pdf-player" ', () => {
    component.contentDetails = {
      contentId: 'do_123',
      contentData: contentMetadata.data.metadata
    };
    component.setPlayerType();
    expect(component.playerType).toEqual('pdf-player');
  });

  it('#adjustPlayerHeight() should set player height', () => {
    component.playerType = 'default-player';
    fixture.detectChanges();
    component.adjustPlayerHeight();
    const element = fixture.debugElement.nativeElement.querySelector('#contentPlayer');
    // expect(element.style.height).toBe('441px');
  });

  xit('#loadDefaultPlayer() ', () => {
    component.playerType = 'default-player';
    fixture.detectChanges();
    // component.loadDefaultPlayer();
  });

  it('#should load PDF player', () => {
    component.playerType = 'pdf-player';
    fixture.detectChanges()
  })

});
