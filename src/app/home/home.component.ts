import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // import the ActivatedRoute so we can get the result of what was resolved
  // before navigating here
  constructor(private sessionService: SessionService,
              private route: ActivatedRoute) { }

  // set the profile to the resolved profile data
  ngOnInit() {
    let routeProfile = this.route.snapshot.data.profile;
    if (routeProfile == null ||
        this.sessionService.getProfile() === routeProfile) {
      return;
    }
    // set the profile to the resolved profile data
    this.sessionService.setProfile(this.route.snapshot.data.profile);
  }

  public getName() {
    return this.sessionService.getProfile().full_name;
  }

}
