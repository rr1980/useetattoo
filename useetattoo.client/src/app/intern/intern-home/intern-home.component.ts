import { Component } from '@angular/core';
import { AuthService } from '../../share/services/auth.service';

@Component({
  selector: 'app-intern-home',
  templateUrl: './intern-home.component.html',
  styleUrls: ['./intern-home.component.scss'],
})
export class InternHomeComponent {
  constructor(private _authService: AuthService) {}

  protected _onClickLogout(e: any): void {
    this._authService.logout();
  }
}
