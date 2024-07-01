import { Injectable, isDevMode } from '@angular/core';

@Injectable()
export class StorageService {
  private _useCrypt: boolean = false;

  constructor() {
    if (isDevMode()) {
      this._useCrypt = false;
    } else {
      this._useCrypt = true;
    }
  }

  public clearSession(): void {
    sessionStorage.clear();
  }

  public clearFromSession(key: string): void {
    if (!key || !key.length) {
      throw new Error('invalid key: ' + key);
    }

    sessionStorage.removeItem(this._encrypt(key));
  }

  // clearPartFromSession(key: string, part: string) {
  //   if (!key || !key.length) {
  //     throw new Error('invalid key: ' + key);
  //   }

  //   var node = this.getFromSession(key);

  //   if (node !== null && node !== undefined) {
  //     delete node[part];
  //     this.saveToSession(key, node);
  //   }
  // }

  public clearFromLocale(key: string): void {
    if (!key || !key.length) {
      throw new Error('invalid key: ' + key);
    }

    localStorage.removeItem(this._encrypt(key));
  }

  // clearPartFromLocale(key: string, part: string) {
  //   if (!key || !key.length) {
  //     throw new Error('invalid key: ' + key);
  //   }

  //   var node = this.getFromLocale(key);

  //   if (node !== null && node !== undefined) {
  //     delete node[part];
  //     this.saveToLocale(key, node);
  //   }
  // }

  public getFromSession<T>(key: string): T | null {
    if (!key || !key.length) {
      throw new Error('invalid key: ' + key);
    }

    const item = sessionStorage.getItem(this._encrypt(key));
    if (item) {
      return this._decrypt<T>(item);
    } else {
      return null;
    }
  }

  public getFromLocale<T>(key: string): T | null {
    if (!key || !key.length) {
      throw new Error('invalid key: ' + key);
    }

    const item = localStorage.getItem(this._encrypt(key));
    if (item) {
      return this._decrypt<T>(item);
    } else {
      return null;
    }
  }

  public saveToSession(key: string, data: any): void {
    if (!key || !key.length) {
      throw new Error('invalid key: ' + key);
    }

    if (data === null || data === undefined) {
      throw new Error('invalid data: ' + data);
    }

    sessionStorage.setItem(this._encrypt(key), this._encrypt(data));
  }

  public saveToLocale(key: string, data: any): void {
    if (!key || !key.length) {
      throw new Error('invalid key: ' + key);
    }

    if (data === null || data === undefined) {
      throw new Error('invalid data: ' + data);
    }
    localStorage.setItem(this._encrypt(key), this._encrypt(data));
  }

  private _encrypt(data: any): string {
    if (this._useCrypt) {
      return btoa(encodeURIComponent(JSON.stringify(data)));
    } else {
      return JSON.stringify(data);
    }
  }

  private _decrypt<T>(data: string): T {
    if (!data) {
      throw new Error('invalid data: ' + data);
    }

    if (this._useCrypt) {
      return JSON.parse(decodeURIComponent(atob(data)));
    } else {
      return JSON.parse(data) as T;
    }
  }
}
