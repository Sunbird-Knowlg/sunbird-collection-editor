import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonFormElementsModule } from 'v-dynamic-forms';
import { SuiModule } from 'v-sb-semantic-ui';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HttpClientModule } from '@angular/common/http';
import { CollectionEditorLibraryComponent } from './collection-editor-library.component';
import { CollectionTreeComponent, ContentplayerPageComponent, EditorBaseComponent, EditorHeaderComponent,
  FancyTreeComponent, MetaFormComponent, LibraryComponent, LibraryFilterComponent, LibraryListComponent,
  LibraryPlayerComponent } from './components';
import {SunbirdPdfPlayerModule} from '@project-sunbird/sunbird-pdf-player-v8';
import { SunbirdVideoPlayerModule } from '@project-sunbird/sunbird-video-player-v8';

@NgModule({
  declarations: [CollectionEditorLibraryComponent, CollectionTreeComponent, ContentplayerPageComponent, EditorBaseComponent,
    EditorHeaderComponent, FancyTreeComponent, MetaFormComponent, LibraryComponent, LibraryFilterComponent, LibraryListComponent,
    LibraryPlayerComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot([]), CommonFormElementsModule, InfiniteScrollModule,
  HttpClientModule, SuiModule, SunbirdPdfPlayerModule, SunbirdVideoPlayerModule],
  exports: [CollectionEditorLibraryComponent, EditorBaseComponent]
})
export class CollectionEditorLibraryModule { }
