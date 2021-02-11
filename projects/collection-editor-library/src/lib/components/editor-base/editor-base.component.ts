import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { TreeService, EditorService, FrameworkService, HelperService, EditorTelemetryService, ToasterService } from '../../services';
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
export class EditorBaseComponent implements OnInit, OnDestroy {

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
  public editorMode;
  public collectionId;
  toolbarConfig: any;
  constructor(public treeService: TreeService, private editorService: EditorService,
              private activatedRoute: ActivatedRoute, private frameworkService: FrameworkService,
              private helperService: HelperService, public telemetryService: EditorTelemetryService, private router: Router,
              private toasterService: ToasterService) {
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.generateTelemetryEndEvent();
  }

  ngOnInit() {
    this.editorService.initialize(this.editorConfig);
    this.editorMode = this.editorService.editorMode;
    this.treeService.initialize(this.editorConfig);
    this.collectionId = _.get(this.editorConfig, 'context.identifier');
    this.toolbarConfig = this.editorService.getToolbarConfig();
    this.fetchCollectionHierarchy().subscribe(
      (response) => {
        const collection = _.get(response, 'result.content');
        this.toolbarConfig.title = collection.name;
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
    this.editorService.getshowLibraryPageEmitter()
      .subscribe(item => this.showLibraryComponentPage());
  }

  fetchCollectionHierarchy(): Observable<any> {
    return this.editorService.fetchCollectionHierarchy(this.collectionId).pipe(tap(data =>
      this.collectionTreeNodes = {
        data: _.get(data, 'result.content')
      }));
  }

  toolbarEventListener(event) {
    switch (event.button) {
      case 'saveContent':
        this.saveContent().then((message: string) => {
          this.toasterService.success(message);
        }).catch(((error: string) => {
          this.toasterService.error(error);
        }));
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
      case 'onFormValueChange':
        this.updateToolbarTitle(event);
        break;
      default:
        break;
    }
  }

  updateToolbarTitle(data: any) {
    const selectedNode = this.treeService.getActiveNode();
    if (!_.isEmpty(data.event.name) && selectedNode.data.root) {
      this.toolbarConfig.title = data.event.name;
    } else if (_.isEmpty(data.event.name) && selectedNode.data.root) {
      this.toolbarConfig.title = 'Untitled';
    } else {}
  }

  showLibraryComponentPage() {
    this.libraryComponentInput = {
      collectionId: this.collectionId
    };
    this.showLibraryPage = true;
  }

  libraryEventListener(event: any) {
    this.fetchCollectionHierarchy().subscribe((res: any) => {
      this.showLibraryPage = false;
      this.telemetryPageId = 'collection-editor';
      this.telemetryService.telemetryPageId = this.telemetryPageId;
    });
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
      this.helperService.reviewContent(this.collectionId).subscribe(data => {
        this.toasterService.success('Successfully sent for review');
        this.router.navigate(['workspace/content/create']);
      }, err => {
        this.toasterService.error('Sending for review failed. Please try again...');
      });
    }).catch(err => this.toasterService.error(err));
  }

  rejectContent(comment) {
    this.helperService.submitRequestChanges(this.collectionId, comment).subscribe(res => {
      this.toasterService.success('Content is sent back for correction');
      this.router.navigate(['workspace/content/create']);
    }, err => {
      this.toasterService.error('Rejecting failed. Please try again...');
    });
  }

  publishContent() {
    this.helperService.publishContent(this.collectionId).subscribe(res => {
      this.toasterService.success('Successfully published');
      this.router.navigate(['workspace/content/create']);
    }, err => {
      this.toasterService.error('Publishing failed. Please try again...');
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

  generateTelemetryEndEvent() {
    const telemetryEnd = {
      type: 'editor',
      pageid: this.telemetryPageId,
      mode: this.editorMode,
      duration: _.toString((Date.now() - this.pageStartTime) / 1000)
    };
    this.telemetryService.end(telemetryEnd);
  }

  ngOnDestroy() {
    this.generateTelemetryEndEvent();
    this.treeService.clearTreeCache();
  }
}
