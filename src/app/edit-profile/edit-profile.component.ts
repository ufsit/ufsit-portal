import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';

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
    grad_year: this.sessionService.getProfile().grad_year,
    subscribe: (this.sessionService.getProfile().mass_mail_optin === 1)
    //reformatting registration to work with the checkbox
  };

  constructor(private sessionService: SessionService) { }

  ngOnInit() {
  }

}
