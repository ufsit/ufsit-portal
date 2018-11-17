import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  // the html form will be bound to these class attributes
  formData: FormGroup;

  // stores the current error
  error = {};
  // a notification is displayed when set to the error object defined here
  notifications = {
    invalid_form: {
      errorMsg: 'Please enter valid credentials.'
    },
    authentication_failure: {
      errorMsg: 'Could not authenticate your credentials. Please try again, or make sure that you\'re registered.'
    },
    generic_error: {
      errorMsg: 'Something went wrong on our end. Please contact the developers.'
    },
    bad_request: {
      errorMsg: 'It looks like you\'re trying to do something sketchy. Remember that "unauthorized penetration tests"' +
        ' are illegal :P. If you believe this is a mistake, please contact the developers.'
    }
  };

  shake = false;

  // import the SessionService and router so we can use them later
  // in other functions
  constructor(private sessionService: SessionService) {

  }

  ngOnInit() {
    const fb: FormBuilder = new FormBuilder();
    this.formData = fb.group({
      email: ['', [
        Validators.required,
        // tslint:disable-next-line:max-line-length
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: ['', [
        Validators.required
      ]]
    });
  }

  // function is called when the user clicks the submit button
  submitLogin() {
    // make sure the form is valid
    if (!this.formData.valid) {
      this.error = this.notifications.invalid_form;
      return;
    }

    // create the form data to submit
    const data = {
      email: this.formData.value.email,
      ufl_email: this.formData.value.email,
      password: this.formData.value.password
    };

    this.sessionService.login(data).subscribe(
      // called if an error was not thrown
      res => {
        // successful login
        if (res === 'Successfully Authenticated') {

        // invalid credentials
        } else if (res.status < 500) {
          this.error = this.notifications.authentication_failure;
        // other error
        } else {
          this.error = this.notifications.generic_error;
        }
      },
      // called if there was an error while logging in
      err => {
        this.error = this.notifications.bad_request;
      }
    );
  }

  // Shakes the notification bar if there was an error. Called when user clicks submit
  notificationShake() {
    if (!this.shake) {
      for (const err in this.notifications) {
        if (err) {
          this.shake = true;
          setTimeout(() => {
            this.shake = false;
          }, 820);
          return;
        }
      }
    }
  }

}
