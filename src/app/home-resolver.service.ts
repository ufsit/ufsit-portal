import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SessionService } from './session.service';
import { RestService } from './rest.service';
import { ActivatedRouteSnapshot } from '@angular/router/src/router_state';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HomeResolverService implements Resolve<any> {

  constructor(private sessionService: SessionService,
              private restService: RestService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (this.sessionService.getProfile() == null) {
      return this.restService.getProfile();
    }
    return null;
  }
}
