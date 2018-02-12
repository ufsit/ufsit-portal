import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { RestService } from '../rest.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit_profile',
  templateUrl: './edit_profile.component.html',
  styleUrls: ['../register/register.component.css']
})
export class EditProfileComponent implements OnInit {

  // the html form will be bound to these class attributes
  formData = { 
    name: this.sessionService.getProfile().full_name,
    email: this.sessionService.getProfile().email,
    grad_year: this.sessionService.getProfile().grad_date,
    subscribe: (this.sessionService.getProfile().mass_mail_optin === 1)
    //reformatting subscribe to work with the checkbox
  };

  //A notification is displayed when it's falue is switched to true
  notifications = {
    generic_error: false,
    generic_success: false,
  };

  //Checks to see if any of the data in the form has changed when the user tries to submit the form
  private form_changed() {
    return this.sessionService.getProfile().full_name !== this.formData.name ||
        this.sessionService.getProfile().email !== this.formData.email ||
        this.sessionService.getProfile().grad_date !== this.formData.grad_year ||
        (this.sessionService.getProfile().mass_mail_optin && this.formData.subscribe);
  };

  constructor(private sessionService: SessionService, 
              private requests: RestService, private router: Router) { }

  ngOnInit() {
  }

  public update_profile(update_form: NgForm) {
    //Scrolls the user to the top of the page
    window.scrollTo(0,0);

    //If the form has not been changed at all, display an error
    if (!this.form_changed()) {
      this.notifications.generic_error = true;
      this.notifications.generic_success = false;   //May not be necessary
      return;
    }

    //This block decides where to send the http get request based
    //on whether it is a user or an admin viewing the account
    let endpoint = '';
    if (this.sessionService.getProfile().user_id) {
      endpoint = this.sessionService.getProfile().user_id;
    }

    this.sessionService.update_profile(this.formData + endpoint);

  }
}
