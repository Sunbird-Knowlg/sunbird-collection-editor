import { Component, Input, OnInit } from '@angular/core';
import { TreeService, EditorService, FrameworkService, HelperService, EditorTelemetryService } from '../../services';
import { IEditorConfig } from '../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
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
              private helperService: HelperService, public telemetryService: EditorTelemetryService, private router: Router) {
    this.editorParams = {
      collectionId: _.get(this.activatedRoute, 'snapshot.params.contentId')
    };
  }

  ngOnInit() {
    this.editorService.editorConfig = this.editorConfig;
    this.treeService.initialize(this.editorConfig);
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
        const channel = _.get(collection, 'channel') || _.get(this.editorConfig, 'context.channel');
        this.helperService.initialize(channel, _.get(this.editorConfig, 'context.defaultLicense'));
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
    switch (event.button) {
      case 'saveContent':
        this.saveContent().then(messg => alert(messg)).catch(err => alert(err));
        break;
      case 'addResource':
        this.showResourceModal = true;
        break;
      case 'addFromLibrary':
          this.showLibraryComponentPage();
          break;
      case 'submitContent':
        this.sendForReview();
        break;
      case 'rejectContent':
      this.rejectContent(event.comment);
      break;
      case 'publishContent':
      this.publishContent();
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
    return new Promise((resolve, reject) => {
      this.editorService.updateHierarchy()
      .pipe(map(data => _.get(data, 'result'))).subscribe(response => {
        if (!_.isEmpty(response.identifiers)) {
          this.treeService.replaceNodeId(response.identifiers);
        }
        this.treeService.clearTreeCache();
        resolve('Hierarchy is Sucessfuly Updated');
      }, err => {
        reject('Something went wrong, Please try later');
      });
    });
  }

  sendForReview() {
    this.saveContent().then(messg => {
      this.helperService.reviewContent(this.editorParams.collectionId).subscribe(data => {
        alert('Successfully sent for review');
        this.router.navigate(['workspace/content/create']);
      }, err => {

      });
    }).catch(err => alert(err));
  }

  rejectContent(comment) {
    this.helperService.submitRequestChanges(this.editorParams.collectionId, comment).subscribe(res => {
      alert('Content is sent back for correction');
      this.router.navigate(['workspace/content/create']);
    }, err => {
    });
  }

  publishContent() {
    this.helperService.publishContent(this.editorParams.collectionId).subscribe(res => {
      alert('Successfully published');
      this.router.navigate(['workspace/content/create']);
    }, err => {
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
