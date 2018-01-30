import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SessionService } from '../session.service';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  // the html form will be bound to these class attributes
  formData = {
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    grad_date: 'Select a semester',
    subscribe: true
  };

  // flags which control which notifications are displayed
  // a notification is displayed when its flag is set to true
  notifications = {
    invalid_credentials: false,
    generic_error: false,
    bad_request: false,
    passwords_do_not_match: false,
    email_conflict: false
  };

  // import the SessionService and router so we can use them later
  // in other functions
  constructor(private sessionService: SessionService,
              private router: Router) { }

  ngOnInit() {
  }

  // function is called when the user clicks the submit button
  submitRegistration(registerForm: NgForm) {
    // if the form is invalid, the password and confirm password don't match,
    // or the grad_date has not been chosen, display an error and do nothing
    if (!registerForm.valid ||
        this.formData.password !== this.formData.confirm_password ||
        this.formData.grad_date == 'Select a semester') {
      this.notifications.invalid_credentials = true;
      return;
    }

    // otherwise, submit the form data to create a new account
    this.sessionService.register(this.formData)
    .subscribe(
      // called if the account was created successfully
      res => {
      console.log(res);
      alert('Success! Your account has been created. You may now log in');
      this.router.navigate(['/login']);
      },
      // called if there was an error while creatign the account
      err => {
        // depending on the error code, display the appropriate notification
        if (err.status === 409) {
          this.notifications.email_conflict = true;
        } else if (err.status === 400) {
          this.notifications.bad_request = true;
        } else {
          this.notifications.generic_error = true;
        }
      }
    );
  }
}
