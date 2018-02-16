import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from './rest.service';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
// provides a service to manage a user's session
export class SessionService {

  private admin = false;

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
  login(formData: {}): Observable<any> {
    // log the user in by calling the rest service's login function
    return this.restService.login(formData).pipe(
      map(res => {
        this.restService.getProfile().subscribe(profile => {
          this.setProfile(profile);
          this.router.navigate(['/home']);
          this.setCachedLoggedIn(true);
        });
        return res;
      }),
      catchError(err => {
        return of(err);
      })
    );
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
        //Needed so that admin tab is not viewable when logged out
        this.admin = false;
      }
    );

  }

  // determines if the user's session is valid
  // used by the authguard service
  validateSession(): Observable<Response> {
    //return the rest service's validate session function
   return this.restService.validateSession().pipe(
      map(res => {
          this.admin = res['admin'];
        return res;
      })
    );
  }

  //returns true if the user is an admin
  public getAdmin(): boolean {
    return this.admin;
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
  register(formData: {}): Observable<any> {
    return this.restService.register(formData).pipe(
      map(res => {
        return res;
      }),
      catchError(err => {
        return of(err);
      })
    );
  }

  // update the user's profile with new name, email, password, or grad year
  public update_profile(formData: {}): Observable<any> {
    return this.restService.update(formData);
  }

}
