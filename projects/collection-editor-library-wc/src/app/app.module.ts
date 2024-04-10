import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { RouterModule } from '@angular/router';
import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { CommonFormElementsModule, DialcodeCursor } from 'common-form-elements-web-v9';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HttpClientModule } from '@angular/common/http';
import { SanitizeHtmlPipe } from '../../../collection-editor-library/src/lib/pipes/sanitize-html.pipe';
import { InterpolatePipe } from '../../../collection-editor-library/src/lib/pipes/interpolate.pipe';
import { CollectionEditorLibraryComponent } from '../../../collection-editor-library/src/lib/collection-editor-library.component';
import { ContentplayerPageComponent } from '../../../collection-editor-library/src/lib/components/contentplayer-page/contentplayer-page.component';
import { EditorComponent } from '../../../collection-editor-library/src/lib/components/editor/editor.component';
import { HeaderComponent } from '../../../collection-editor-library/src/lib/components/header/header.component';
import { FancyTreeComponent } from '../../../collection-editor-library/src/lib/components/fancy-tree/fancy-tree.component';
import { MetaFormComponent } from '../../../collection-editor-library/src/lib/components/meta-form/meta-form.component';
import { LibraryComponent } from '../../../collection-editor-library/src/lib/components/library/library.component';
import { LibraryFilterComponent } from '../../../collection-editor-library/src/lib/components/library-filter/library-filter.component';
import { LibraryListComponent } from '../../../collection-editor-library/src/lib/components/library-list/library-list.component';
import { LibraryPlayerComponent } from '../../../collection-editor-library/src/lib/components/library-player/library-player.component';
import { ResourceReorderComponent } from '../../../collection-editor-library/src/lib/components/resource-reorder/resource-reorder.component';
import { SkeletonLoaderComponent } from '../../../collection-editor-library/src/lib/components/skeleton-loader/skeleton-loader.component';
import { QumlplayerPageComponent } from '../../../collection-editor-library/src/lib/components/qumlplayer-page/qumlplayer-page.component';
import { QumlLibraryModule } from '@project-sunbird/sunbird-quml-player';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TelemetryInteractDirective } from '../../../collection-editor-library/src/lib/directives/telemetry-interact/telemetry-interact.directive';
import { DateFormatPipe } from '../../../collection-editor-library/src/lib/directives/date-format/date-format.pipe';
import { AssetBrowserComponent } from '../../../collection-editor-library/src/lib/components/asset-browser/asset-browser.component';
import { CollectionIconComponent } from '../../../collection-editor-library/src/lib/components/collection-icon/collection-icon.component';
import { QumlPlayerComponent } from '../../../collection-editor-library/src/lib/components/quml-player/quml-player.component';
import { DialcodeComponent } from '../../../collection-editor-library/src/lib/components/dialcode/dialcode.component';
import { DialcodeService } from '../../../collection-editor-library/src/lib/services/dialcode/dialcode.service';
import { CsvUploadComponent } from '../../../collection-editor-library/src/lib/components/csv-upload/csv-upload.component';
import { ManageCollaboratorComponent } from '../../../collection-editor-library/src/lib/components/manage-collaborator/manage-collaborator.component';
import { PublishChecklistComponent } from '../../../collection-editor-library/src/lib/components/publish-checklist/publish-checklist.component';
import { RelationalMetadataComponent } from '../../../collection-editor-library/src/lib/components/relational-metadata/relational-metadata.component';
import { ResourceLibraryModule } from '@project-sunbird/sunbird-resource-library';
import { AppLoaderComponent } from '../../../collection-editor-library/src/lib/components/app-loader/app-loader.component';
import { A11yModule } from '@angular/cdk/a11y';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    CollectionEditorLibraryComponent,
    InterpolatePipe,
    SanitizeHtmlPipe,
    ContentplayerPageComponent,
    EditorComponent,
    QumlplayerPageComponent,
    HeaderComponent,
    FancyTreeComponent,
    MetaFormComponent,
    LibraryComponent,
    LibraryFilterComponent,
    LibraryListComponent,
    LibraryPlayerComponent,
    ResourceReorderComponent,
    SkeletonLoaderComponent,
    DateFormatPipe,
    TelemetryInteractDirective,
    AssetBrowserComponent,
    CollectionIconComponent,
    QumlPlayerComponent,
    DialcodeComponent,
    CsvUploadComponent,
    ManageCollaboratorComponent,
    PublishChecklistComponent
    AppLoaderComponent,
    RelationalMetadataComponent
  ],
  imports: [
    CommonModule, BrowserModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot([]), SuiModule,
    CommonFormElementsModule, InfiniteScrollModule, HttpClientModule,
    QumlLibraryModule, CarouselModule, ResourceLibraryModule, A11yModule
  ],
  providers: [
    { provide: DialcodeCursor, useExisting: DialcodeService },
  ],
  entryComponents: [EditorComponent]
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) { }
  ngDoBootstrap() {
    const customElement = createCustomElement(EditorComponent, { injector: this.injector });
    customElements.define('lib-editor', customElement);
  }

}
