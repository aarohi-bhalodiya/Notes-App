import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';

import { NotesRoutingModule } from './notes-routing.module';
import { CreateNotesComponent } from './create-notes/create-notes.component';
import { UpdateNotesComponent } from './update-notes/update-notes.component';
import { NotesComponent } from './notes.component';
import {MatIconModule} from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';



@NgModule({
  declarations: [
    NotesComponent,
    CreateNotesComponent,
    UpdateNotesComponent
  ],
  imports: [
    BrowserModule,
    NotesRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatTableModule,
    MatIconModule,
    MatSortModule 
  ],
  providers: [],
})
export class NotesModule { }
