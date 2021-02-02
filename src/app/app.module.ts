import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { CollectionEditorLibraryModule } from 'collection-editor-library';
import { AppComponent } from './app.component';
import { EditorRoutingModule } from './editor-routing.module';
import { CollectionEditorComponent } from './collection-editor/collection-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    CollectionEditorComponent
  ],
  imports: [
    BrowserModule,
    CollectionEditorLibraryModule,
    EditorRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
