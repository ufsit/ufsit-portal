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

  // flags which control which notifications are displayed
  // a notification is displayed when its flag is set to true
  notifications = {
    invalid_credentials: false,
    generic_error: false,
    bad_request: false
  };

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
      this.notifications.invalid_credentials = true;
      return;
    }

    // create the form data to submit
    const data = {
      email: this.formData.value.email,
      password: this.formData.value.password
    };

    this.sessionService.login(data).subscribe(
      // called if an error was not thrown
      res => {
        // successful login
        if (res === 'Successfully Authenticated') {

        // invalid credentials
        } else if (res.status < 500) {
          this.notifications.invalid_credentials = true;
        // other error
        } else {
          this.notifications.generic_error = true;
        }
      },
      // called if there was an error while logging in
      err => {
        this.notifications.bad_request = true;
      }
    );
  }

}
