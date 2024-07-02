import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {

  protected _dark: boolean = false;
  protected _showIntern: boolean = false;
  protected _showLogout: boolean = false;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _storageService: StorageService,
    private _apiService: ApiService
  ) {
    this._dark = this._storageService.getFromLocale<boolean>('isDark') || false;
    document.documentElement.setAttribute(
      'data-bs-theme',
      this._dark === true ? 'dark' : 'light'
    );

    this._subscriptions.push(
      this._router.events.subscribe((val) => {
        if (val instanceof NavigationEnd) {
          if (val.url.startsWith('/intern')) {
            this._showIntern = false;
          } else {
            this._showIntern = true;
            this._authService.logout();
          }
        }
      })
    );
  }

  public ngOnDestroy(): void {
    if (this._subscriptions && this._subscriptions.length > 0) {
      for (let index = 0; index < this._subscriptions.length; index++) {
        const element = this._subscriptions[index];
        element.unsubscribe();
      }
    }
  }

  protected _change(changes: any): void {
    document.documentElement.setAttribute(
      'data-bs-theme',
      this._dark === true ? 'dark' : 'light'
    );

    this._storageService.saveToLocale('isDark', this._dark);
  }

  //---


  protected _onClickTest(e: any): void {
    this._getForecasts();
  }

  private _getForecasts(): void {
    this._apiService.get<any[]>('/weatherforecast').subscribe({
      next: (result: any) => {
        console.debug('weatherforecast',result);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
}
