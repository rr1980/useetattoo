import { Component } from '@angular/core';
import { AuthService } from '../share/services/auth.service';
import { Router } from '@angular/router';
import { WeatherForecast } from '../intern/intern-home/intern-home.component';
import { ApiService } from '../share/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public forecasts: WeatherForecast[] = [];

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _apiService: ApiService
  ) {}

  protected _onClickLogin(e: any): void {
    console.log('Login clicked');

    this._authService.login(
      'Rene',
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

  protected _onClickTest(e: any): void {
    this._getForecasts();
  }

  private _getForecasts(): void {
    this._apiService.get<WeatherForecast[]>('/weatherforecast').subscribe({
      next: (result: any) => {
        console.debug(result);
        this.forecasts = result;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
}
