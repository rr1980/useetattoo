import { Component } from '@angular/core';
import { AuthService } from '../../share/services/auth.service';
import { ApiService } from '../../share/services/api.service';
import { RouteKeys } from '../../share/helper/route-keys.helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intern-home',
  templateUrl: './intern-home.component.html',
  styleUrls: ['./intern-home.component.scss'],
})
export class InternHomeComponent {
  constructor(
    private _authService: AuthService,
    private _apiService: ApiService,
    private _router: Router
  ) {}

  protected _onClickLogout(e: any): void {
    this._authService.logout();
  }

  protected _onClickTest(e: any): void {
    console.debug('Test button clicked');

    this._apiService.post<any>(RouteKeys.Intern.Person.getAll).subscribe({
      next: (response: any) => {
        console.debug('Response', response);
      },
      error: (err: any) => {
        throw err;
      },
    });
  }

  protected _onClickNew(e: any): void {
    this._router.navigate(['intern/newDeclaration']);
  }
}
