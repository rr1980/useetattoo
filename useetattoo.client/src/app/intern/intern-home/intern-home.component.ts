import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../share/services/auth.service';
import { ApiService } from '../../share/services/api.service';

export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-intern-home',
  templateUrl: './intern-home.component.html',
  styleUrls: ['./intern-home.component.scss'],
})
export class InternHomeComponent implements OnInit {
  public forecasts: WeatherForecast[] = [];

  constructor(
    private _authService: AuthService,
    private _apiService: ApiService
  ) {}

  ngOnInit() {}

  protected _onClickLogout(e: any): void {
    this._authService.logout();
  }

  protected _onClickTest(e: any): void {
    this._getForecasts();
  }

  private _getForecasts() {
    this._apiService.get<WeatherForecast[]>('/weatherforecast').subscribe(
      (result: any) => {
        console.log(result);
        this.forecasts = result;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
}
