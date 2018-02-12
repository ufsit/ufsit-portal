import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { RestService } from '../rest.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
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
              private requests: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  public cancel_update() {

  };

}
