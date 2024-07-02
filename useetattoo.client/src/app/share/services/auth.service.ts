import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { RouteKeys } from '../helper/route-keys.helper';
import { ApiService } from './api.service';

@Injectable()
export class AuthService {
  constructor(
    private _apiService: ApiService,
    private _storageService: StorageService,
    private _router: Router
  ) {}

  public login(
    benutzername: string,
    passwort: string,
    okCb: () => void,
    errCb: (err: any) => void
  ): void {
    // this._storageService.saveToSession('token', '1234567890');
    // okCb();

    this._apiService
      .post<any>(RouteKeys.Auth.get_token, {
        username: benutzername,
        password: passwort,
      })
      .subscribe({
        next: (response: any) => {
          this._storageService.saveToSession('token', response.token);
          //     this._storageService.saveToSession('rollen', response.rollen);
          okCb();
        },
        error: (err: any) => {
          errCb(err);
        },
      });
  }

  public logout(): void {
    this._storageService.clearSession();
    // this._router.navigate(['/extern']);
  }

  public isLoggedIn(): boolean {
    const token = this._storageService.getFromSession<string>('token');
    if (token && token.length) {
      return true;
    }

    return false;
  }
}
