import { Component } from '@angular/core';
import { AuthService } from '../share/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  protected _formData: any = {
    user: 'rr1980',
    password: '123'
  };
  protected _isLoading: boolean = false;

  protected _passwordEditorOptions: any = {
    placeholder: 'Password',
    stylingMode:'filled',
    mode: 'password',
    // value: 'password',
    // buttons: [{
    //   name: 'password',
    //   location: 'after',
    //   options: {
    //     icon: 'info',
    //     stylingMode:'text',
    //     onClick: () => this.changePasswordMode(),
    //   }
    // }]
  }

  constructor(private _authService: AuthService, private _router: Router) {}

  protected _onClickLogin(e: any): void {
    console.log('Login clicked', this._formData);

    this._isLoading = true;
    // setTimeout(() => {
    //   this._isLoading = false;
    // }, 2000);

    this._authService.login(
      this._formData.user,
      this._formData.password,
      () => {
        this._isLoading = false;
        console.debug('Login successful');
        this._router.navigate(['/intern']);
      },
      (err: any) => {
        this._isLoading = false;
        console.debug('Login failed', err);
      }
    );
  }
}
