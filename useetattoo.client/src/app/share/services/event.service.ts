import { Injectable } from '@angular/core';

@Injectable()
export class EventService {
  private _events: { [key: string]: { lasValue: any; items: any[] } } = {};

  constructor() {}

  public fire(event: string, data: any): void {
    if (!this._events[event]) {
      this._events[event] = { lasValue: null, items: [] };
    }
    this._events[event].lasValue = data;
    this._events[event].items.forEach((cb: (data: any) => void) => {
      cb(data);
    });
  }

  public on(event: string, cb: (data: any) => void): void {
    if (!this._events[event]) {
      this._events[event] = { lasValue: null, items: [] };
    }
    this._events[event].items.push(cb);
    this.getLasValue(event, cb);
  }

  public getLasValue(event: string, cb: (data: any) => void): void {
    if (!this._events[event]) {
      cb(null);
    }

    cb(this._events[event].lasValue);
  }
}
