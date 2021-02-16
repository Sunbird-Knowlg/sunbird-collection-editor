import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonFormElementsModule } from 'common-form-elements';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HttpClientModule } from '@angular/common/http';
import { CollectionEditorLibraryComponent } from './collection-editor-library.component';
import { ContentplayerPageComponent } from './components/contentplayer-page/contentplayer-page.component';
import { EditorBaseComponent } from './components//editor-base/editor-base.component';
import { EditorHeaderComponent } from './components/editor-header/editor-header.component';
import { FancyTreeComponent } from './components/fancy-tree/fancy-tree.component';
import { MetaFormComponent } from './components/meta-form/meta-form.component';
import { LibraryComponent } from './components/library/library.component';
import { LibraryFilterComponent } from './components/library-filter/library-filter.component';
import { LibraryListComponent } from './components/library-list/library-list.component';
import { LibraryPlayerComponent } from './components/library-player/library-player.component';
import { ResourceReorderComponent } from './components/resource-reorder/resource-reorder.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import {SunbirdPdfPlayerModule} from '@project-sunbird/sunbird-pdf-player-v8';
import { SunbirdVideoPlayerModule } from '@project-sunbird/sunbird-video-player-v8';
import { TelemetryInteractDirective } from './directives/telemetry-interact/telemetry-interact.directive';
@NgModule({
  declarations: [CollectionEditorLibraryComponent, ContentplayerPageComponent, EditorBaseComponent,
    EditorHeaderComponent, FancyTreeComponent, MetaFormComponent, LibraryComponent, LibraryFilterComponent, LibraryListComponent,
    LibraryPlayerComponent, ResourceReorderComponent, SkeletonLoaderComponent, TelemetryInteractDirective],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, CommonFormElementsModule, InfiniteScrollModule,
  HttpClientModule, SuiModule, SunbirdPdfPlayerModule, SunbirdVideoPlayerModule],
  exports: [EditorBaseComponent]
})
export class CollectionEditorLibraryModule { }
