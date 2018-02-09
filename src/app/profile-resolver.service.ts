import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RestService } from './rest.service';
import { SessionService } from './session.service';
import { of } from 'rxjs/observable/of';


@Injectable()
// waits for the result of getting a user's profile before navigating to a page
// which uses the resolver
export class ProfileResolverService implements Resolve<any> {

  constructor(private sessionService: SessionService,
              private restService: RestService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    // get the id parameter
    let id = route.params.id;

    // check if there is no id (the user is loading their own profile)
    if (id == undefined) {
      // get the user's own profile data
        return this.restService.getProfile();
    }
    // otherwise, the user is an admin loading another user's profile
    // get the other user's data from the server
    return this.restService.getProfile(id);
  }
}
