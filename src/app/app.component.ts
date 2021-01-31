import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GlobalVariable } from './app.global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  //Variable to store user login details
  user: any = {
    email: '',
    password: '',
  };
  //check if token is stored in local storage. Used to render the login page
  islogedOut =
    localStorage.getItem('token') == 'null' ||
    localStorage.getItem('token') == undefined;
  title: any;

  constructor(
    private http: HttpClient,
    private route: Router,
    public snackBar: MatSnackBar
  ) {
    //check if token is stored in local storage. Navigate to login page is not found
    if (
      localStorage.getItem('token') != 'null' &&
      localStorage.getItem('token') != undefined
    ) {
      this.route.navigate(['/notes']);
    } else {
      localStorage.setItem('token', null);
      this.islogedOut = true;
    }
    localStorage.setItem('registerNavigate', 'false');
  }

  ngOnInit() {
    //check if token is stored in local storage. Navigate to login page is not found
    if (
      localStorage.getItem('token') != 'null' &&
      localStorage.getItem('token') != undefined
    ) {
      this.route.navigate(['/notes']);
    } else {
      localStorage.setItem('token', null);
      this.islogedOut = true;
    }
  }
  /**
   * Method to navigate to Register user page which is called when Register button is clicked
   */
  registerNewUser() {
    localStorage.setItem('registerNavigate', 'true');
    this.route.navigate(['/registration']);
  }
  /**
   * Method to check and login which is called when login button is clicked
   */
  submit() {
    //check if email and password is entered
    if (this.user.email && this.user.password) {
      //call API to validate user login
      this.http.post(GlobalVariable.LOGIN, this.user).subscribe(
        (data) => {
          //check code is 200 and redirect to All notes
          if (data && data['code'] == 200) {
            localStorage.setItem('token', data['result'].token);
            this.islogedOut = false;
            this.snackBar.open('Login Successful', 'close', { duration: 3000 });
            //clear email and password from login page
            this.user = {
              email: '',
              password: '',
            };
            //navigate to all notes
            this.route.navigate(['/notes']);
          }
        },
        (error) => {
          this.snackBar.open(error.error.error, 'close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Please enter valid credentials!', 'close', {
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
   * Method to check registerNavigate which is used in HTML code to render the login form
   */
  get checkRegisterNavigate(): boolean {
    return localStorage.getItem('registerNavigate') == 'false';
  }
  /**
   * Method to logout and clear the token
   */
  logout() {
    localStorage.setItem('token', null);
    this.route.navigate(['/']);
  }
}
