import { Component } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected _theme: string = 'light';

  constructor() {
    registerLocaleData(localeDe, 'de-DE', localeDeExtra);
  }

  protected _onThemeChange(theme: string): void {
    this._theme = theme;
  }
}
