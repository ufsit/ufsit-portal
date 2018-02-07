import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from './rest.service';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
// provides a service to manage a user's session
export class SessionService {

  // import the Router and RestService so we can use them in later functions
  constructor(private router: Router,
              private restService: RestService) {}
  // cache the login/logout state so the header knows what to display
  // it is here rather than the header in case other components need it later
  private cachedLoggedIn: boolean;

  // cache the user's profile data so we don't have to constantly get it
  // from the server
  private profile = null;

  // logs the user in, given their email and password
  login(formData: {}): Observable<ArrayBuffer> {
    // log the user in by calling the rest service's login function
    return this.restService.login(formData);
  }

  // logs the user out
  logout() {
    // log the user out by calling the rest service's logout function
    this.restService.logout().subscribe(
      // called once the user is logged out on the server side
      res => {
        // set the cached login value to false
        this.cachedLoggedIn = false;
        // clear the profile data
        this.profile = null;
        // navigate back to the login page
        this.router.navigate(['/login']);
      }
    );

  }

  // determines if the user is logged in
  // used by the authguard service
  isLoggedIn(stateUrl: string = ''): Observable<boolean> {
    // return the rest service's validate session function
    return this.restService.validateSession().pipe(
      // called if the user is logged in
      map(res => {
        // make sure the cached login value is true
        this.cachedLoggedIn = true;
        // if the user navigates to the login or register page and he or she
        // is already logged in, navigate to the home page
        if(stateUrl == '/login' || stateUrl == '/register'){
          this.router.navigate(['/home']);
          // return false so the login or register page won't load
          return false;
        }
        // otherwise, the user is elsewhere on the site and already logged in,
        // so return true to so the route will load
        return true;
      }),
      // called if the user is not logged in
      catchError(err => {
        // make sure the cached login value is false
        this.cachedLoggedIn = false;
        // if the user is not already at the login or register page
        // redirect him or her to the login page
        if (! (stateUrl == '/login' || stateUrl == '/register') ) {
          this.router.navigate(['/login']);
          // return false so the login or register page won't load
          return of(false);
        }
        // otherwise the user is already at the login or register page
        // and is not logged in, so return true so the route will load
        return of(true);
      })
    );
  }

  // get the cached login value
  public getCachedLoggedIn(): boolean {
    return this.cachedLoggedIn;
  }

  // set the cached login value
  public setCachedLoggedIn(newValue: boolean): void {
    this.cachedLoggedIn = newValue;
  }

  // get profile data
  public getProfile() {
    return this.profile;
  }

  // set profile data
  public setProfile(newProfile) {
    this.profile = newProfile;
  }

  // register the user using his or her name, email, password, graduation year,
  // and subscribe preference
  register(formData: {}): Observable<ArrayBuffer> {
    return this.restService.register(formData);
  }

}
