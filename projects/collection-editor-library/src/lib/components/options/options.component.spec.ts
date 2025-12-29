import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { OptionsComponent } from './options.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { mockOptionData } from './options.component.spec.data';
import { ConfigService } from '../../services/config/config.service';
import { SuiModule } from '@project-sunbird/ng2-semantic-ui';
import { TreeService } from '../../services/tree/tree.service';
import { treeData } from './../fancy-tree/fancy-tree.component.spec.data';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { EditorService } from "../../services/editor/editor.service";

const mockEditorService = {
  editorConfig: {
    config: {
      renderTaxonomy:true,
      hierarchy: {
        level1: {
          name: "Module",
          type: "Unit",
          mimeType: "application/vnd.ekstep.content-collection",
          contentType: "Course Unit",
          iconClass: "fa fa-folder-o",
          children: {},
        },
      },
    },
  },
  parentIdentifier: ""
};


describe('OptionsComponent', () => {
  let component: OptionsComponent;
  let fixture: ComponentFixture<OptionsComponent>;
  let treeService,telemetryService;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, FormsModule, SuiModule ],
      declarations: [ OptionsComponent, TelemetryInteractDirective ],
      providers: [ConfigService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsComponent);
    treeService = TestBed.inject(TreeService);
    telemetryService = TestBed.inject(EditorTelemetryService);
    component = fixture.componentInstance;
    component.sourcingSettings = sourcingSettingsMock;
    spyOn(treeService, 'setTreeElement').and.callFake((el) => {
      treeService.nativeElement = nativeElement;
    });
    spyOn(treeService, 'getFirstChild').and.callFake(() => {
      return { data: { metadata: treeData } };
    });
    component.editorState = mockOptionData.editorOptionData;

    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit() should call editorDataHandler on ngOnInit', () => {
    component.editorState = mockOptionData.editorOptionData;
    spyOn(component, 'editorDataHandler');
    component.ngOnInit();
    expect(component.editorDataHandler).toHaveBeenCalled();
  });

  it('should not set #templateType when creating new question', () => {
    component.editorState = {};
    spyOn(component, 'editorDataHandler');
    component.ngOnInit();
    expect(component.templateType).toEqual('mcq-vertical');
  });

  it('should set #templateType when updating an existing question', () => {
    component.editorState = mockOptionData.editorOptionData;
    spyOn(component, 'editorDataHandler');
    component.ngOnInit();
    expect(component.templateType).toEqual('mcq-split-grid');
  });

  it('#editorDataHandler() should emit option data', () => {
    spyOn(component, 'prepareMcqBody').and.callThrough();
    spyOn(component.editorDataOutput, 'emit').and.callThrough();
    component.editorState = mockOptionData.editorOptionData;
    component.editorDataHandler();
    expect(component.prepareMcqBody).toHaveBeenCalledWith(mockOptionData.editorOptionData);
    expect(component.editorDataOutput.emit).toHaveBeenCalled();
  });

  it('#prepareMcqBody() should return expected mcq option data', () => {
    spyOn(component, 'getResponseDeclaration').and.callThrough();
    spyOn(component, 'getInteractions').and.callThrough();
    const result = component.prepareMcqBody(mockOptionData.editorOptionData);
    expect(mockOptionData.prepareMcqBody).toEqual(result);
    expect(component.getResponseDeclaration).toHaveBeenCalledWith(mockOptionData.editorOptionData);
    expect(component.getInteractions).toHaveBeenCalledWith(mockOptionData.editorOptionData.options);
  });

  it('#getResponseDeclaration() should return expected response declaration', () => {
    const result = component.getResponseDeclaration(mockOptionData.editorOptionData);
    expect(mockOptionData.prepareMcqBody.responseDeclaration).toEqual(result);
  });

  it('#getInteractions() should return expected response declaration', () => {
    const result = component.getInteractions(mockOptionData.editorOptionData.options);
    expect(mockOptionData.prepareMcqBody.interactions).toEqual(result);
  });

  it('#setTemplete() should set #templateType to "mcq-vertical-split"  ', () => {
    spyOn(component, 'editorDataHandler').and.callThrough();
    const templateType = 'mcq-vertical-split';
    component.editorState = mockOptionData.editorOptionData;
    component.setTemplete(templateType);
    expect(component.templateType).toEqual(templateType);
    expect(component.editorDataHandler).toHaveBeenCalled();
  });

});
