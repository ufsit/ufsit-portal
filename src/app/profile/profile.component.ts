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

  // copied from stack exchange for now, this may be improved later
  timeAgo(): string {
    let date = new Date(this.profile.registration_date);

    let seconds = Math.floor((new Date().valueOf() - date.valueOf()) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + ' years ago';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + ' months ago';
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + ' days ago';
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + ' hours ago';
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + ' minutes ago';
    }
    return Math.floor(seconds) + ' seconds ago';
  }

}
