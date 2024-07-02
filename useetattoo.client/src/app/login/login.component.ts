import { Component } from '@angular/core';
import { AuthService } from '../share/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private _authService: AuthService, private _router: Router) {}

  protected _onClickLogin(e: any): void {
    console.log('Login clicked');

    this._authService.login(
      'rr1980',
      '123',
      () => {
        console.debug('Login successful');
        this._router.navigate(['/intern']);
      },
      (err: any) => {
        console.debug('Login failed', err);
      }
    );
  }
}
