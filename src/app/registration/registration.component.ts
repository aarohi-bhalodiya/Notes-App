import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../app.global';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  //User variable to store details for registration form
  user: any = {
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
  };
  //FormGroup to use in form validations
  userForm: FormGroup;
  //variable to hide the password
  hide = true;
  constructor(
    private http: HttpClient,
    private route: Router,
    public snackBar: MatSnackBar
  ) {
    //Set the value to local storage which is used to hide the login form in all pages
    localStorage.setItem('registerNavigate', 'true');
  }

  ngOnInit(): void {
    //Initialize the form with validators
    this.userForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
  /**
   * Method to register user when Register button is clicked
   */
  submit() {
    //check if all the fields are entered
    if (
      this.user.firstName &&
      this.user.lastName &&
      this.user.email &&
      this.user.userName &&
      this.user.password
    ) {
      //call API to register the user and save in database
      this.http.post(GlobalVariable.REGISTRATION, this.user).subscribe(
        (data) => {
          //Check the code if 200
          if (data && data['code'] == 200) {
            this.snackBar.open('User created successfully', 'close', {
              duration: 3000,
            });
            //save the value into localstorage used to hide login page
            localStorage.setItem('registerNavigate', 'false');
            this.route.navigate(['/']);
          }
        },
        (error) => {
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
   * Method to navigate to login page which is called when cancel button is clicked
   */
  cancel() {
    localStorage.setItem('registerNavigate', 'false');
    this.route.navigate(['/']);
  }
}
