import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CollectionEditorLibraryModule, EditorCursor } from 'collection-editor-library';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { QuestionCursor } from '@project-sunbird/sunbird-quml-player';
import { EditorCursorImplementationService } from './editor-cursor-implementation.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CollectionEditorLibraryModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([], {})
  ],
  providers: [
    { provide: QuestionCursor, useExisting: EditorCursorImplementationService },
    { provide: EditorCursor, useExisting: EditorCursorImplementationService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
