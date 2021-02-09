import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonFormElementsModule } from 'v-dynamic-forms';
import { SuiModule } from 'v-sb-semantic-ui';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HttpClientModule } from '@angular/common/http';
import { CollectionEditorLibraryComponent } from './collection-editor-library.component';
import { ContentplayerPageComponent, EditorBaseComponent, EditorHeaderComponent,
  FancyTreeComponent, MetaFormComponent, LibraryComponent, LibraryFilterComponent, LibraryListComponent,
  LibraryPlayerComponent } from './components';
import {SunbirdPdfPlayerModule} from '@project-sunbird/sunbird-pdf-player-v8';
import { SunbirdVideoPlayerModule } from '@project-sunbird/sunbird-video-player-v8';
import { EditorService } from './services';
import { ResourceReorderComponent } from './components/resource-reorder/resource-reorder.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';

@NgModule({
  providers: [EditorService],
  declarations: [CollectionEditorLibraryComponent, ContentplayerPageComponent, EditorBaseComponent,
    EditorHeaderComponent, FancyTreeComponent, MetaFormComponent, LibraryComponent, LibraryFilterComponent, LibraryListComponent,
    LibraryPlayerComponent, ResourceReorderComponent, SkeletonLoaderComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, CommonFormElementsModule, InfiniteScrollModule,
  HttpClientModule, SuiModule, SunbirdPdfPlayerModule, SunbirdVideoPlayerModule],
  exports: [CollectionEditorLibraryComponent, EditorBaseComponent]
})
export class CollectionEditorLibraryModule { }
