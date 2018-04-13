import { Injectable } from '@angular/core';
import {
    CanActivate, Router, ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { SessionService } from './session.service';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()

// determines if a user is allowed to navigate to a page based on the result
// of validating the user's session
export class AuthGuardService implements CanActivate {
    constructor(private router: Router,
        private sessionService: SessionService) { }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | boolean {
        const stateUrl = state.url;
        // returns the result of validating the user's session
        return this.sessionService.validateSession().pipe(
            // called if the user is logged in
            map(res => {
                // make sure the cached login value is true
                this.sessionService.setCachedLoggedIn(true);
                // if the user navigates to the login or register page and he or she
                // is already logged in, navigate to the home page
                if (stateUrl === '/login' || stateUrl === '/register') {
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
                this.sessionService.setCachedLoggedIn(false);
                // if the user is not already at the login or register page
                // redirect him or her to the login page
                if (!(stateUrl === '/login' || stateUrl === '/register')) {
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
}
