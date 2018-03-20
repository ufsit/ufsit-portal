import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
              private route: ActivatedRoute,
              private router: Router) { }

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

  public redirectLectures() {
    // tslint:disable-next-line:max-line-length
    window.open('https://uflorida-my.sharepoint.com/personal/elan22_ufl_edu/_layouts/15/guestaccess.aspx?folderid=0d67d1c9bc1be4aa68ea7bd61d21b612a&authkey=AbD-gTKCDdCIpE8vtELGWzw', '_blank');
  }

  public redirectResume() {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLScP-7T3VGFAcgVOcr12ErLfM0qIh4P9YjaxvCE8dqxIQ2sxVQ/viewform', '_blank');
  }

  public routeTo(path: string) {
    this.router.navigate([path]);
  }

    // public accessor for session
  public getSession() {
    return this.sessionService;
  }

}
