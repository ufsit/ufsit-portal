import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot,
          RouterStateSnapshot } from '@angular/router';
import { SessionService } from './session.service';
import { Observable } from 'rxjs/Observable';

@Injectable()

// determines if a user is allowed to navigate to a page based on the result
// of validating the user's session
export class AuthGuardService implements CanActivate {
  constructor(private router: Router,
              private sessionService: SessionService) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean>|boolean {
    // returns the result of validating the user's session
    return this.sessionService.isLoggedIn(state.url);
  }
}
