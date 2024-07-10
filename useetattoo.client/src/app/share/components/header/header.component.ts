import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { EventService } from '../../services/event.service';
import themes from 'devextreme/ui/themes';
import { refreshTheme } from 'devextreme/viz/themes';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  protected _dark: boolean = false;
  protected _location: string = '';
  protected _showLogout: boolean = false;
  protected _isMenuCollapsed: boolean = true;
  private _subscriptions: Subscription[] = [];

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _storageService: StorageService,
    private _eventService: EventService
  ) {
    this._dark = this._storageService.getFromLocale<boolean>('isDark') || false;

    themes.current('generic.' + (this._dark === true ? 'dark' : 'light'));
    refreshTheme();

    document.documentElement.setAttribute(
      'data-bs-theme',
      this._dark === true ? 'dark' : 'light'
    );

    this._subscriptions.push(
      this._router.events.subscribe((val) => {
        if (val instanceof NavigationEnd) {
          if (
            val.url.startsWith('/intern') &&
            !val.url.startsWith('/intern/newDeclaration')
          ) {
            this._location = 'intern';
          } else if (val.url.startsWith('/extern')) {
            this._location = 'home';
            this._authService.logout();
          } else if (val.url.startsWith('/intern/newDeclaration')) {
            this._location = 'declaration';
          } else if (val.url.startsWith('/login')) {
            this._location = 'login';
            this._authService.logout();
          } else {
            this._location = 'unknown (' + val.url + ')';
            this._authService.logout();
          }

          // console.debug('Location is:', this._location);
        }
      })
    );
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this._eventService.fire(
        'onThemeChange',
        this._dark === true ? 'dark' : 'light'
      );
    }, 0);
  }

  public ngOnDestroy(): void {
    if (this._subscriptions && this._subscriptions.length > 0) {
      for (let index = 0; index < this._subscriptions.length; index++) {
        const element = this._subscriptions[index];
        element.unsubscribe();
      }
    }
  }

  protected _change(e: any): void {
    document.documentElement.setAttribute(
      'data-bs-theme',
      this._dark === true ? 'dark' : 'light'
    );

    themes.current('generic.' + (this._dark === true ? 'dark' : 'light'));
    refreshTheme();
    console.debug(themes.current());

    this._storageService.saveToLocale('isDark', this._dark);
    this._eventService.fire(
      'onThemeChange',
      this._dark === true ? 'dark' : 'light'
    );
  }
}
