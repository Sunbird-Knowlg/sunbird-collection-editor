import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollectionEditorComponent } from './collection-editor/collection-editor.component';

const routes: Routes = [
  {
    path: 'edit/collection/:collectionId', component: CollectionEditorComponent, pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule { }
