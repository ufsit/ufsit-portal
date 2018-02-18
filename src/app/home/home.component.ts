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

  ngOnInit() {
    // get the resolved profile data
    const routeProfile = this.route.snapshot.data.profile;
    // if there is no cached profile data, set it to the resolved data
    if (this.sessionService.getProfile() == null) {
      this.sessionService.setProfile(routeProfile);
    }
  }

  public getName() {
    if (this.sessionService.getProfile() != null) {
      return this.sessionService.getProfile().full_name;
    }
    return '';
  }

}
