import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../session.service';
import { share } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // import the SessionService so we can use them later in other functions
  constructor(private session: SessionService) { }

  private navbarCollapsed = true;

  ngOnInit() {
  }

  // logout by calling the session service's logout function
  logout() {
    this.session.logout();
  }

  // public accessor for session
  getSession() {
    return this.session;
  }

  // public accessor for navbarCollapsed
  public getNavbarCollapsed() {
    return this.navbarCollapsed;
  }

  // toggle navbarCollapsed
  public toggleNavbarCollapsed() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  public setNavbarCollapsed(newState: boolean) {
    this.navbarCollapsed = newState;
  }

}
