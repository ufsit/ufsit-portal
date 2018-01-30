import { Injectable } from '@angular/core';
import { Router, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RestService } from './rest.service';
import { map } from 'rxjs/operators';


@Injectable()
// waits for the result of getting a user's profile before navigating to a page
// which uses the resolver
export class ProfileResolverService implements Resolve<any> {

  constructor(private restService: RestService) { }

  resolve(): Observable<any> {
    return this.restService.getProfile();
  }
}
