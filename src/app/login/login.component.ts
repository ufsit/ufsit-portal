import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  // the html form will be bound to these class attributes
  formData = {
    'email': '',
    'password': ''
  };

  // flags which control which notifications are displayed
  // a notification is displayed when its flag is set to true
  notifications = {
    invalid_credentials: false,
    generic_error: false,
    bad_request: false
  };

  // import the SessionService and router so we can use them later
  // in other functions
  constructor(private sessionService: SessionService,
              private router: Router) {

  }

  ngOnInit() {
  }

  // function is called when the user clicks the submit button
  submitLogin(loginForm: NgForm) {
    if (!loginForm.valid) {
      this.notifications.invalid_credentials = true;
      return;
    }

    this.sessionService.login(this.formData)
    .subscribe(
      // called if the account was created successfully
      res => {
        res.subscribe(profile => {
          this.sessionService.setProfile(profile);
        });
      },
      // called if there was an error while creatign the account
      err => {
        // depending on the error code, display the appropriate notification
        if (err.status === 400) {
          this.notifications.bad_request = true;
        } else {
          this.notifications.generic_error = true;
        }
      }
    );
  }

}
