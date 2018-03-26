import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SessionService } from '../session.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // profile holds the profile data we are currently viewing
  private profile;
  private title = '';
  private editLink = '';

  // import the ActivatedRoute so we can get the result of what was resolved
  // before navigating here
  constructor(private sessionService: SessionService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // get the id of the user we are viewing
    let id = this.route.snapshot.params.id;

    // set the profile data based on what the resolver returned to us
    this.profile = this.route.snapshot.data.profile;

    // if there is no id (the user is looking at their own profile)
    // set the title and editLink accordingly
    if (id == undefined) {
      this.title = 'Your Profile';
      this.editLink = '/profile/edit';

      // get the resolved data
      const routeProfile = this.route.snapshot.data.profile;
      console.log(routeProfile);
      // as long as the resolved data isn't null, update the cached profile
      // information with the resolved data
      if (routeProfile != null) {
        this.sessionService.setProfile(routeProfile);
      }
    // otherwise, the user is an admin looking at another user's profile
    // set the title and edit link accordingly
    } else {
      this.title = this.profile.full_name + '\'s Profile';
      this.editLink = '/profile/' + id + '/edit';
    }
  }

  // get page title
  public getTitle() {
    return this.title;
  }

  // get edit link
  public getEditLink() {
    return this.editLink;
  }

  // get profile
  public getProfile() {
    return this.profile;
  }
}
