import { Injectable } from '@angular/core';
import { Router, Resolve } from '@angular/router';
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

  resolve(): Observable<any> {
    if (this.sessionService.getProfile() == null) {
      return this.restService.getProfile();
    }
    return of(this.sessionService.getProfile());
  }
}
