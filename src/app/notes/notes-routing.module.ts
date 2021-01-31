import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateNotesComponent } from './create-notes/create-notes.component';
import { UpdateNotesComponent } from './update-notes/update-notes.component';

const routes: Routes = [
  { path: 'createNote', component: CreateNotesComponent },
  { path: 'updateNote/:id', component: UpdateNotesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotesRoutingModule {}
