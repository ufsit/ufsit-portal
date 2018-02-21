import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { RestService } from '../rest.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileResolverService } from '../profile-resolver.service';

@Component({
  selector: 'app-edit_profile',
  templateUrl: './edit_profile.component.html',
  styleUrls: ['../app.component.css']
})

export class EditProfileComponent implements OnInit {
  formData: FormGroup;
  private success_text: String;
  private error_text: String;
  private success_items: {};

  // A notification is displayed when it's falue is switched to true
  notifications = {
    invalid_credentials: false,
    generic_error: false,
    bad_request: false,
  };

  // Checks to see if any of the data in the form has changed when the user tries to submit the form
  private form_changed() {
    return (this.sessionService.getProfile().full_name !== this.formData.value.name ||
        this.sessionService.getProfile().email !== this.formData.value.email ||
        this.sessionService.getProfile().grad_date !== this.formData.value.grad_year ||
        (this.formData.value.new_password !== '' && this.formData.value.confirm_password !== ''));
       // (this.sessionService.getProfile().mass_mail_optin this.formData.value.subscribe);
  }

  constructor(private sessionService: SessionService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sessionService.setProfile(this.route.snapshot.data.profile);

    const fb: FormBuilder = new FormBuilder();
    this.formData = fb.group({
      name: [this.sessionService.getProfile().full_name, [
        Validators.required
      ]],
      email: [this.sessionService.getProfile().email, [
        Validators.required,
        // tslint:disable-next-line:max-line-length
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ]],
      
      ufl_email: [this.sessionService.getProfile().ufl_email, [
        Validators.required,
        // tslint:disable-next-line:max-line-length
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ]],  

      old_password: ['', []],
      
      new_password: ['', []],

      confirm_password: ['', []],

      grad_year: [this.sessionService.getProfile().grad_date, [
        Validators.required
      ]],
      subscribe: ['true', []]
    });
  }

  public update_profile() {
    // Scrolls the user to the top of the page
    window.scrollTo(0, 0);

    // If the form is not valid display error
    if (!this.formData.valid || this.formData.value.old_password === '' ||
      this.formData.value.new_password !== this.formData.value.confirm_password ||
      this.formData.value.grad_year === 'Select a semester' || !this.form_changed()) {
      this.notifications.invalid_credentials = true;
      return;
    }

    // This block decides where to send the http get request based
    // on whether it is a user or an admin viewing the account
    let endpoint = '';
    if (this.sessionService.getProfile().user_id) {
      endpoint = this.sessionService.getProfile().user_id;
    }

    this.sessionService.update_profile(this.formData, endpoint).subscribe(
      // called if the account was created successfully
      res => {
        if (res.status === undefined) {
          window.location.reload();
          alert('Success!  You have changed:\n ' + res);
        }
        else if (res.status === 409) {
          this.notifications.bad_request = true;
        }
        else if (res.status === 400) {
          this.notifications.invalid_credentials = true;
        }
        else {
          this.notifications.generic_error = true;
        }
      },
      err => {
        this.notifications.invalid_credentials = true;
        window.scrollTo(0, 0);
      }
    );
  }
}
