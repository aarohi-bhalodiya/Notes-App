import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GlobalVariable } from '../app.global';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

//Interface to declare the structure of Note object from database which will be used prepare array
export interface NoteStructure {
  name: string;
  description: string;
  actions: string;
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit, AfterViewInit {

  notes: NoteStructure[];
  displayedColumns: string[] = ['name', 'description', 'actions'];
  dataSource = new MatTableDataSource([]);
  noRecordsFound = false;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: HttpClient,
    private route: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    //call API to get the notes
    this.getNotes();
  }
  /**
   * Method to get notes on page load
   */
  getNotes() {
    //Call API to get all notes
    this.http
      .post(GlobalVariable.GET_NOTES, { token: localStorage.getItem('token') })
      .subscribe(
        (data) => {
          this.notes = data['result'];
          if(this.notes.length > 0){
            //assign the data to table source data
            this.dataSource.data = this.notes;
          }
          else{
            this.noRecordsFound = true;
          }          
        },
        (error) => {
          //navigate back to login page if token error
          if (error.error.code == 403) {
            localStorage.setItem('token', null);
            this.route.navigate(['/']);
          }
          this.snackBar.open(error.error.error, 'close', { duration: 3000 });
        }
      );
  }
  /**
   * Method to delete note. It is called on click of delete button
   */
  deleteNote(id) {
    //initialize the deleteNoteData variable with id and token
    let deleteNoteData = {
      id: id,
      token: localStorage.getItem('token'),
    };
    //call api to delete the note
    this.http.post(GlobalVariable.DELETE_NOTES, deleteNoteData).subscribe(
      (data) => {
        this.getNotes();
        this.snackBar.open('Note deleted successfully', 'close', {
          duration: 3000,
        });
      },
      (error) => {
        this.snackBar.open(error.error.error, 'close', { duration: 3000 });
      }
    );
  }
  /**
   * Method to sort on after view init
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
