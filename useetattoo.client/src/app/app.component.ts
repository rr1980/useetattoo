import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from './share/services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('errorModal', { static: false })
  protected _errorModal?: TemplateRef<any>;

  protected _theme: string = 'light';
  protected _error?: any;

  constructor(
    private _bs_modalService: NgbModal,
    private _modalService: ModalService
  ) {
    registerLocaleData(localeDe, 'de-DE', localeDeExtra);
    this._modalService.on('error', (error: any): void => {
      console.debug('Error modal opened', error);
      this._error = error;

      this._bs_modalService
        .open(this._errorModal, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          (result) => {
            // this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    });
  }

  protected _onThemeChange(theme: string): void {
    console.debug('Theme changed to:', theme);
    this._theme = theme;
  }
}
