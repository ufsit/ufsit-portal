import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  formData: FormGroup;
  private checkedWaiver = false;

  // flags which control which notifications are displayed
  // a notification is displayed when its flag is set to true
  notifications = {
    invalid_credentials: false,
    generic_error: false,
    bad_request: false,
    email_conflict: false,
    unsigned_waiver: false
  };

    // import the SessionService and router so we can use them later
    // in other functions
    constructor(private sessionService: SessionService,
        private router: Router) { }

  ngOnInit() {
    const fb: FormBuilder = new FormBuilder();
    this.formData = fb.group({
      name: ['', [
        Validators.required
      ]],
      email: ['', [
        Validators.required,
        // tslint:disable-next-line:max-line-length
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: ['', [
        Validators.required
      ]],
      confirm_password: ['', [
        Validators.required
      ]],
      grad_date: ['Already Graduated', [
        Validators.required
      ]],
      subscribe: ['true', []]
    });
  }

  signWaiver(event) {
    if (event.target.checked) {
      this.checkedWaiver = true;
    }
    else {
      this.checkedWaiver = false;
    }
  }

  // function is called when the user clicks the submit button
  submitRegistration() {
    // if the form is invalid, the password and confirm password don't match,
    // or the grad_date has not been chosen, display an error and do nothing

    if (this.formData.value.ufl_email === '') {
      this.formData.value.ufl_email = 'left_blank@ufl.edu';
    } else if (this.formData.value.email === '') {
      this.formData.value.email = 'left_blank@ufl.edu';
    }

    if (!this.formData.valid ||
        this.formData.value.password !== this.formData.value.confirm_password ||
        this.formData.value.grad_date === 'Select a semester' ||
        this.formData.value.email === this.formData.value.ufl_email ||
        (this.formData.value.email === '' && this.formData.value.ufl_email === '') ||
        (this.formData.value.email === 'left_blank@ufl.edu' || this.formData.value.ufl_email === 'left_blank@ufl.edu')) 
        {
      this.notifications.invalid_credentials = true;
      return;
    }

    if (this.checkedWaiver === false) {
      alert('Please acknowledge that you have read and agreed to the terms and conditions.');
      return;
    }

    // otherwise, submit the form data to create a new account
    this.sessionService.register(this.formData.value)
    .subscribe(
      res => {
        // if the account was created successfully, notify user and
        // navigate to the login page
        if (res === 'Success') {
          alert('Success! Your account has been created. You may now log in');
          this.router.navigate(['/login']);
        // depending on the error code, display the appropriate notification
        } else if (res.status === 409) {
          this.notifications.email_conflict = true;
        } else if (res.status === 400) {
          this.notifications.bad_request = true;
        } else {
          this.notifications.generic_error = true;
        }
      });

        // otherwise, submit the form data to create a new account
        this.sessionService.register(this.formData.value)
            .subscribe(
                res => {
                    // if the account was created successfully, notify user and
                    // navigate to the login page
                    if (res === 'Success') {
                        alert('Success! Your account has been created. You may now log in');
                        this.router.navigate(['/login']);
                        // depending on the error code, display the appropriate notification
                    } else if (res.status === 409) {
                        this.notifications.email_conflict = true;
                    } else if (res.status === 400) {
                        this.notifications.bad_request = true;
                    } else {
                        this.notifications.generic_error = true;
                    }
                },
                // called if there was an error while creatign the account
                err => {
                    this.notifications.bad_request = true;
                }
            );
    }
}
