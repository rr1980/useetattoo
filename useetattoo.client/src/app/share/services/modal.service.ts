import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {
  private _events: any[] = [];

  constructor() {}

  public openErrorModal(error: any): void {
    this._events.forEach((event: any) => {
      if (event.event === 'error') {
        event.cb(error);
      }
    });
  }

  public on(event: string, cb: (data: any) => void): void {
    this._events.push({ event, cb });
  }
}
