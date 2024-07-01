import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-extern-home',
  templateUrl: './extern-home.component.html',
  styleUrls: ['./extern-home.component.scss'],
})
export class ExternHomeComponent {
  constructor(private _router: Router) {}

  protected _onClickLogin(e: any): void {
    console.log('Login clicked');

    this._router.navigate(['/login']);
  }
}
