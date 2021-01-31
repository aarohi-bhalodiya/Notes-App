import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../../app.global';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-notes',
  templateUrl: './create-notes.component.html',
  styleUrls: ['./create-notes.component.scss'],
})
export class CreateNotesComponent implements OnInit {
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
    //Navigate to home in case token is not found
    if (
      localStorage.getItem('token') == 'null' ||
      localStorage.getItem('token') == undefined
    ) {
      this.route.navigate(['/']);
    }
  }
  /**
   * Method to create note which is called when Create note button is clicked
   */
  submit() {
    //Call create note API if name and description is entered
    if (this.note.name && this.note.description) {
      this.http.post(GlobalVariable.CREATE_NOTES, this.note).subscribe(
        (data) => {
          //check code and if code is 200, navigate to All notes
          if (data && data['code'] == 200) {
            this.snackBar.open('Note created successfully', 'close', {
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
   * Method to navigate to All Notes page which is called when cancel button is clicked
   */
  cancel() {
    //Navigate to all notes if cancel button is clicked
    this.route.navigate(['/notes']);
  }
  /**
   * Method to check token which is used in HTML code to render the login form
   */
  get checkStorage(): boolean {
    return localStorage.getItem('token') == 'null';
  }
}
