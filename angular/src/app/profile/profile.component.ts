import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SessionService } from '../session.service';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private profile;

  // import the ActivatedRoute so we can get the result of what was resolved
  // before navigating here
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // set the profile to the resolved profile data
    this.profile = this.route.snapshot.data.profile;
    // convert mass_mail_optin from 0/1 to false/true
    if (this.profile.mass_mail_optin) {
      this.profile.mass_mail_optin = true;
    } else {
      this.profile.mass_mail_optin = false;
    }
  }

  //public accessor for profile
  public getProfile(){
    return this.profile;
  }

}
