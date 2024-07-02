import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-extern-home',
  templateUrl: './extern-home.component.html',
  styleUrls: ['./extern-home.component.scss'],
})
export class ExternHomeComponent {
  constructor(private _router: Router) {}

  protected _onClickNew(e: any): void {
    this._router.navigate(['extern/newDeclaration']);
  }
}
