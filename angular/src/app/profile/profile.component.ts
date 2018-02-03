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
  // import the ActivatedRoute so we can get the result of what was resolved
  // before navigating here
  constructor(private sessionService: SessionService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.sessionService.getProfile() === this.route.snapshot.data.profile) {
      return;
    }
    // set the profile to the resolved profile data
    this.sessionService.setProfile(this.route.snapshot.data.profile);
  }

}
