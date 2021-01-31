import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../../app.global';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-notes',
  templateUrl: './update-notes.component.html',
  styleUrls: ['./update-notes.component.scss'],
})
export class UpdateNotesComponent implements OnInit {
  //variable to store note id
  note_id: any;
  //note variable to store note record
  note: any = {
    name: '',
    description: '',
    token: localStorage.getItem('token'),
  };
 //constructor
  constructor(
    private http: HttpClient,
    private route: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    //get the note id from url
    this.note_id = this.route.url.split('/')[2];
    //initialize the note variable with id and token
    const noteToFind = {
      id: this.note_id,
      token: localStorage.getItem('token'),
    };
    //call api to populate the note fields
    this.http.post(GlobalVariable.GET_NOTES_BY_ID, noteToFind).subscribe(
      (data) => {
        //check code and if code is 200
        if (data && data['code'] == 200) {
          this.note.name = data['result'].name;
          this.note.description = data['result'].description;
        }
      },
      (error) => {
        //check code and if code is 403, navigate to login page
        if (error.error.code == 403) {
          localStorage.setItem('token', null);
          this.route.navigate(['/']);
        }
        this.snackBar.open(error.error.error, 'close', { duration: 3000 });
      }
    );
  }
  /**
   * Method to update note which is called when update note button is clicked
   */
  submit() {
    //Call update note API if name and description is entered
    if (this.note.name && this.note.description) {
      this.note.id = this.note_id;
      this.http.put(GlobalVariable.UPDATE_NOTES, this.note).subscribe(
        (data) => {
          //check code and if code is 200, navigate to All notes
          if (data && data['code'] == 200) {
            this.snackBar.open('Note updated successfully', 'close', {
              duration: 3000,
            });
            this.route.navigate(['/notes']);
          }
        },
        (error) => {
          //check code and if code is 403, navigate to login page
          if (error.error.code == 403) {
            localStorage.setItem('token', null);
            this.route.navigate(['/']);
          }
          this.snackBar.open(error.error.error, 'close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Please enter all fields', 'close', {
        duration: 3000,
      });
    }
  }
  /**
   * Method to check token which is used in HTML code to render the login form
   */
  get checkStorage(): boolean {
    return localStorage.getItem('token') == 'null';
  }
  /**
   * Method to navigate to All Notes page which is called when cancel button is clicked
   */
  cancel() {
    this.route.navigate(['/notes']);
  }
}
