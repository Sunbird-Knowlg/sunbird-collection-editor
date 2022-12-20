import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonFormElementsModule, DialcodeCursor } from 'common-form-elements-web-v9';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HttpClientModule } from '@angular/common/http';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { InterpolatePipe } from './pipes/interpolate.pipe';
import { CollectionEditorLibraryComponent } from './collection-editor-library.component';
import { ContentplayerPageComponent } from './components/contentplayer-page/contentplayer-page.component';
import { EditorComponent } from './components/editor/editor.component';
import { HeaderComponent } from './components/header/header.component';
import { FancyTreeComponent } from './components/fancy-tree/fancy-tree.component';
import { MetaFormComponent } from './components/meta-form/meta-form.component';
import { LibraryComponent } from './components/library/library.component';
import { LibraryFilterComponent } from './components/library-filter/library-filter.component';
import { LibraryListComponent } from './components/library-list/library-list.component';
import { LibraryPlayerComponent } from './components/library-player/library-player.component';
import { TemplateComponent } from './components/template/template.component';
import { ResourceReorderComponent } from './components/resource-reorder/resource-reorder.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { QumlplayerPageComponent } from './components/qumlplayer-page/qumlplayer-page.component';
import { OptionsComponent } from './components/options/options.component';
import { AnswerComponent } from './components/answer/answer.component';
import { CkeditorToolComponent } from './components/ckeditor-tool/ckeditor-tool.component';
import { QuestionComponent } from './components/question/question.component';
import {SunbirdPdfPlayerModule} from '@project-sunbird/sunbird-pdf-player-v9';
import { SunbirdEpubPlayerModule } from '@project-sunbird/sunbird-epub-player-v9';
import { SunbirdVideoPlayerModule } from '@project-sunbird/sunbird-video-player-v9';
import { QumlLibraryModule } from '@project-sunbird/sunbird-quml-player';
import {CarouselModule} from 'ngx-bootstrap/carousel';
import { TelemetryInteractDirective } from './directives/telemetry-interact/telemetry-interact.directive';
import { DateFormatPipe } from './directives/date-format/date-format.pipe';
import { AssetBrowserComponent } from './components/asset-browser/asset-browser.component';
import { CollectionIconComponent } from './components/collection-icon/collection-icon.component';
import { CacheService } from 'ng2-cache-service';
import { CacheStorageAbstract } from 'ng2-cache-service/dist/src/services/storage/cache-storage-abstract.service';
import { CacheSessionStorage } from 'ng2-cache-service/dist/src/services/storage/session-storage/cache-session-storage.service';
import { QumlPlayerComponent } from './components/quml-player/quml-player.component';
import { DialcodeComponent } from './components/dialcode/dialcode.component';
import { DialcodeService } from './services/dialcode/dialcode.service';
import { QuestionOptionSubMenuComponent } from './components/question-option-sub-menu/question-option-sub-menu.component';
import { CsvUploadComponent } from './components/csv-upload/csv-upload.component';
import { ManageCollaboratorComponent } from './components/manage-collaborator/manage-collaborator.component';
import { SliderComponent } from './components/slider/slider.component';
import { TranslationsComponent } from './components/translations/translations.component';
import { PublishChecklistComponent } from './components/publish-checklist/publish-checklist.component';
import { BulkUploadComponent  } from './components/bulk-upload/bulk-upload.component';
import { RelationalMetadataComponent } from './components/relational-metadata/relational-metadata.component';
import { ResourceLibraryModule } from '@project-sunbird/sunbird-resource-library';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { AssignPageNumberComponent } from './components/assign-page-number/assign-page-number.component';
import { PlainTreeComponent } from './components/plain-tree/plain-tree.component';
import { A11yModule } from '@angular/cdk/a11y';
import {TermAndConditionComponent} from './components/term-and-condition/term-and-condition.component';

import { QualityParamsModalComponent } from './components/quality-params-modal/quality-params-modal.component';
@NgModule({
  declarations: [CollectionEditorLibraryComponent, InterpolatePipe, SanitizeHtmlPipe, ContentplayerPageComponent,
    EditorComponent, QumlplayerPageComponent, HeaderComponent, FancyTreeComponent, MetaFormComponent, LibraryComponent,
    LibraryFilterComponent, LibraryListComponent, QuestionComponent, OptionsComponent, AnswerComponent, CkeditorToolComponent,
    LibraryPlayerComponent, ResourceReorderComponent, SkeletonLoaderComponent, TemplateComponent, DateFormatPipe,
    TelemetryInteractDirective, AssetBrowserComponent, CollectionIconComponent,
    QumlPlayerComponent, DialcodeComponent, BulkUploadComponent, CsvUploadComponent, ManageCollaboratorComponent,
    PublishChecklistComponent, QuestionOptionSubMenuComponent, SliderComponent, TranslationsComponent,AppLoaderComponent,
    RelationalMetadataComponent,
    AssignPageNumberComponent,
    PlainTreeComponent,
    TermAndConditionComponent,
    QualityParamsModalComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild([]), SuiModule,
  CommonFormElementsModule, InfiniteScrollModule, HttpClientModule, SunbirdPdfPlayerModule, SunbirdVideoPlayerModule,
  QumlLibraryModule, CarouselModule, SunbirdEpubPlayerModule, ResourceLibraryModule, A11yModule],
  providers: [
    CacheService,
    { provide: CacheStorageAbstract, useClass: CacheSessionStorage },
    { provide: DialcodeCursor, useExisting: DialcodeService }
  ],
  exports: [EditorComponent]
})
export class CollectionEditorLibraryModule { }
