import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { RestService } from '../rest.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ProfileResolverService } from '../profile-resolver.service';

@Component({
    selector: 'app-edit_profile',
    templateUrl: './edit_profile.component.html',
    styleUrls: ['../app.component.css']
})

export class EditProfileComponent implements OnInit {

  // profile holds the profile data we are currently viewing
  private profile;
  public title = '';

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

    // get the id of the user we are viewing
    const id = this.route.snapshot.params.id;

    // set the profile data based on what the resolver returned to us
    this.profile = this.route.snapshot.data.profile;

    // if there is no id (the user is looking at their own profile)
    // set the title and editLink accordingly
    if (id === undefined) {
        this.title = 'Your Profile';
        // otherwise, the user is an admin looking at another user's profile
        // set the title and edit link accordingly
    } else {
        this.title = this.profile.full_name + '\'s Profile';
    }

    //this.sessionService.setProfile(this.route.snapshot.data.profile);

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
    this.notifications.invalid_credentials = false;
    this.notifications.bad_request = false;
    this.notifications.generic_error = false;

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
                //window.location.reload();
                alert('Success!  You have changed:\n ' + res);
            } else if (res.status === 409) {
                this.notifications.bad_request = true;
            } else if (res.status === 400) {
                this.notifications.invalid_credentials = true;
            } else {
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
