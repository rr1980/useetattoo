import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Injectable()
export class SpecialErrorHandler implements ErrorHandler {
  constructor(private _modalService: ModalService) {}

  public handleError(error: any): void {
    console.error(error);
    if (error instanceof HttpErrorResponse) {
      if (!error.status) {
        console.error(error.message || error.toString());
      } else {
        switch (error.status) {
          case 401:
            break;
          default:
            this._handle({
              status: error.status,
              title: error.statusText,
            });
            break;
        }
      }
    } else {
      this._handle({
        status: null,
        title: error.message ? error.message : error.toString(),
      });
    }
  }

  private _handle(error: any): void {
    this._modalService.openErrorModal(error);
  }
}
