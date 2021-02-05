import { Component, Input, OnInit } from '@angular/core';
import { TreeService, EditorService, FrameworkService, HelperService, EditorTelemetryService } from '../../services';
import { IEditorConfig } from '../../interfaces';
import { toolbarConfig } from '../../editor.config';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as _ from 'lodash-es';

interface IeditorParams {
  collectionId: string;
}
@Component({
  selector: 'lib-editor-base',
  templateUrl: './editor-base.component.html',
  styleUrls: ['./editor-base.component.scss']
})
export class EditorBaseComponent implements OnInit {

  @Input() editorConfig: IEditorConfig | undefined;
  public collectionTreeNodes: any;
  public selectedNodeData: any = {};
  toolbarConfig = toolbarConfig;
  public showQuestionTemplate = false;
  public showResourceModal = false;
  private editorParams: IeditorParams;
  public telemetryPageId = 'collection-editor';
  public pageStartTime;
  public rootFormConfig: any;
  public unitFormConfig: any;
  public showLibraryPage = false;
  public libraryComponentInput: any;

  constructor(private editorService: EditorService, public treeService: TreeService,
              private activatedRoute: ActivatedRoute, private frameworkService: FrameworkService,
              private helperService: HelperService, public telemetryService: EditorTelemetryService) {
              this.editorParams = { collectionId: _.get(this.activatedRoute, 'snapshot.params.collectionId') };
  }

  ngOnInit() {
    this.editorService.editorConfig = this.editorConfig;
    this.fetchCollectionHierarchy().subscribe(
      (response) => {
        const collection = _.get(response, 'result.content');
        const organisationFramework = _.get(this.editorConfig, 'context.framework') || _.get(collection, 'framework');
        const targetFramework = _.get(this.editorConfig, 'context.targetFWIds') || _.get(collection, 'targetFWIds');
        if (organisationFramework) {
          this.frameworkService.initialize(organisationFramework);
        }
        if (!_.isEmpty(targetFramework)) {
          this.frameworkService.getTargetFrameworkCategories(targetFramework);
        }
        this.helperService.initialize(_.get(collection, 'originData.channel'), _.get(this.editorConfig, 'context.defaultLicense'));
      });
    this.editorService.getCategoryDefinition(this.editorConfig.config.primaryCategory,
      this.editorConfig.context.channel, this.editorConfig.config.objectType)
      .subscribe(
        (response) => {
          this.unitFormConfig = _.get(response, 'result.objectCategoryDefinition.forms.unitMetadata.properties');
          this.rootFormConfig = _.get(response, 'result.objectCategoryDefinition.forms.create.properties');
        },
        (error) => {
          console.log(error);
        }
      );
    this.pageStartTime = Date.now();
    this.telemetryService.initializeTelemetry(this.editorConfig);
    this.telemetryService.telemetryPageId = this.telemetryPageId;
    this.telemetryService.start({ type: 'editor', pageid: this.telemetryPageId });
  }

  fetchCollectionHierarchy(): Observable<any> {
    return this.editorService.fetchCollectionHierarchy(this.editorParams).pipe(tap(data =>
      this.collectionTreeNodes = {
        data: _.get(data, 'result.content')
      }));
  }

  toolbarEventListener(event) {
    switch (event.button.type) {
      case 'saveContent':
        this.saveContent();
        break;
      case 'addResource':
        this.showResourceModal = true;
        break;
      case 'addFromLibrary':
        this.showLibraryComponentPage();
        break;
      default:
        break;
    }
  }

  showLibraryComponentPage() {
    this.libraryComponentInput = {
      questionSetId: this.editorParams.collectionId
    };
    this.showLibraryPage = true;
  }

  libraryEventListener(event: any) {
    this.showLibraryPage = false;
  }

  saveContent() {
    this.editorService.updateHierarchy()
      .pipe(map(data => _.get(data, 'result'))).subscribe(response => {
        if (!_.isEmpty(response.identifiers)) {
          this.treeService.replaceNodeId(response.identifiers);
        }
        this.treeService.clearTreeCache();
        alert('Hierarchy is Sucessfuly Updated');
      });
  }

  treeEventListener(event: any) {
    switch (event.type) {
      case 'nodeSelect':
        this.selectedNodeData = _.cloneDeep(event.data);
        break;
      default:
        break;
    }
  }

  onProceedClick(event) {
    this.editorService.emitResourceAddition(_.get(event, 'data'));
    this.showResourceModal = false;
  }

  generateTelemetryEndEvent(eventMode) {
    const telemetryEnd = {
      type: 'editor',
      pageid: this.telemetryPageId,
      mode: eventMode || '',
      duration: _.toString((Date.now() - this.pageStartTime) / 1000)
    };
    this.telemetryService.end(telemetryEnd);
  }
}
