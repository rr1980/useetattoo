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

  public ngOnDestroy(): void {
    if (this._subscriptions && this._subscriptions.length > 0) {
      for (let index = 0; index < this._subscriptions.length; index++) {
        const element = this._subscriptions[index];
        element.unsubscribe();
      }
    }
  }
}
