import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionService } from './session.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class AdminGuardService implements CanActivate {

  constructor(private router: Router,
    private sessionService: SessionService) { }

  public canActivate(route: ActivatedRouteSnapshot,
                      state: RouterStateSnapshot): Observable<boolean>|boolean {
    if (!this.sessionService.getAdmin()) {
      this.router.navigate(['/home']);
    }

    return this.sessionService.getAdmin();
  }
}
