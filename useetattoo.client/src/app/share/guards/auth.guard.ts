import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  CanLoad,
  Route,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private _router: Router, private _authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const returnUrl = state.url.split('?')[0];
    return this.can(returnUrl);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    let returnUrl = this._router
      .getCurrentNavigation()!
      .extractedUrl.toString()
      .split('?')[0];
    return this.can(returnUrl);
  }

  can(returnUrl: string) {
    if (this._authService.isLoggedIn()) {
      return true;
    }

    console.debug('AuthGuard: redirect to login');
    this._router.navigate(['/extern']);
    return false;
  }
}
