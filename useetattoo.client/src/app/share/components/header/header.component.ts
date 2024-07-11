import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { EventService } from '../../services/event.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  // protected _dark: boolean = false;
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
    this._subscriptions.push(
      this._router.events.subscribe((val) => {
        if (val instanceof NavigationEnd) {
          console.debug('NavigationEnd:', val.url);
          if (val.urlAfterRedirects.startsWith('/intern/home')) {
            this._location = 'intern/home';
          } else if (val.urlAfterRedirects.startsWith('/extern/home')) {
            this._location = 'extern/home';
            this._authService.logout();
          } else if (val.urlAfterRedirects.startsWith('/intern/newDeclaration') || val.urlAfterRedirects.startsWith('/intern/showDeclaration')) {
            this._location = 'editDeclaration';
          } else if (val.urlAfterRedirects.startsWith('/login')) {
            this._location = 'login';
            this._authService.logout();
          } else {
            this._location = 'unknown (' + val.urlAfterRedirects + ')';
            this._authService.logout();
          }

          // console.debug('Location is:', this._location);
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
}
