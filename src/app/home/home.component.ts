import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SessionService } from '../session.service';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

    public lecturePath;
    public resumePath;
    private customTiles;

    // import the ActivatedRoute so we can get the result of what was resolved
    // before navigating here
    constructor(
        private sessionService: SessionService,
        private route: ActivatedRoute,
        private router: Router,
        private requests: RestService
    ) { }

    ngOnInit() {
        // tslint:disable-next-line:max-line-length
        this.lecturePath = 'https://uflorida-my.sharepoint.com/personal/elan22_ufl_edu/_layouts/15/guestaccess.aspx?folderid=0d67d1c9bc1be4aa68ea7bd61d21b612a&authkey=AbD-gTKCDdCIpE8vtELGWzw';
        this.resumePath = 'https://docs.google.com/forms/d/e/1FAIpQLScP-7T3VGFAcgVOcr12ErLfM0qIh4P9YjaxvCE8dqxIQ2sxVQ/viewform';

        this.requests.customTiles().subscribe(
            success => { this.customTiles = success; },
            failure => { console.log(failure); }
        );

        const routeProfile = this.route.snapshot.data.profile;

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

    public getCustomTiles() {
        return this.customTiles;
    }

    public redirect(path: string) {
        window.open(path, '_blank');
    }

    public customTileClick(id, link) {
        this.requests.customTileClick(id);
        this.redirect(link);
    }

    public routeTo(path: string) {
        this.router.navigate([path]);
    }

    // public accessor for session
  public getElection() {
    return this.sessionService.getElection();
  }

  public getBadge() {
    let rank = 0;
    if (this.sessionService.getProfile() != null) {
        rank = this.sessionService.getProfile().rank;
    }
    if (rank <= 0) {
      return '';
    } else if (rank < 3) {
        return 'assets/images/ranks/white.png';
    } else if (rank < 5) {
        return 'assets/images/ranks/yellow.png';
    } else if (rank < 10) {
        return 'assets/images/ranks/green.png';
    } else if (rank < 20) {
        return 'assets/images/ranks/blue.png';
    } else if (rank < 40) {
        return 'assets/images/ranks/purple.png';
    } else if (rank < 65) {
        return 'assets/images/ranks/red.png';
    } else if (rank < 100) {
        return 'assets/images/ranks/brown.png';
    } else {
        return 'assets/images/ranks/black.png';
    }
  }

}
