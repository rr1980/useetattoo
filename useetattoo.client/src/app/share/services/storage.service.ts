import { Injectable, isDevMode } from '@angular/core';

@Injectable()
export class StorageService {
  useCrypt: boolean = false;

  constructor() {
    if (isDevMode()) {
      this.useCrypt = false;
    } else {
      this.useCrypt = true;
    }
  }

  clearSession() {
    sessionStorage.clear();
  }

  clearFromSession(key: string) {
    if (!key || !key.length) {
      throw new Error('invalid key: ' + key);
    }

    sessionStorage.removeItem(this.encrypt(key));
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

  clearFromLocale(key: string) {
    if (!key || !key.length) {
      throw new Error('invalid key: ' + key);
    }

    localStorage.removeItem(this.encrypt(key));
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

  getFromSession<T>(key: string): T | null {
    if (!key || !key.length) {
      throw new Error('invalid key: ' + key);
    }

    const item = sessionStorage.getItem(this.encrypt(key));
    if (item) {
      return this.decrypt<T>(item);
    } else {
      return null;
    }
  }

  getFromLocale<T>(key: string): T | null {
    if (!key || !key.length) {
      throw new Error('invalid key: ' + key);
    }

    const item = localStorage.getItem(this.encrypt(key));
    if (item) {
      return this.decrypt<T>(item);
    } else {
      return null;
    }
  }

  saveToSession(key: string, data: any) {
    if (!key || !key.length) {
      throw new Error('invalid key: ' + key);
    }

    if (data === null || data === undefined) {
      throw new Error('invalid data: ' + data);
    }

    sessionStorage.setItem(this.encrypt(key), this.encrypt(data));
  }

  saveToLocale(key: string, data: any) {
    if (!key || !key.length) {
      throw new Error('invalid key: ' + key);
    }

    if (data === null || data === undefined) {
      throw new Error('invalid data: ' + data);
    }
    localStorage.setItem(this.encrypt(key), this.encrypt(data));
  }

  private encrypt(data: any): string {
    if (this.useCrypt) {
      return btoa(encodeURIComponent(JSON.stringify(data)));
    } else {
      return JSON.stringify(data);
    }
  }

  private decrypt<T>(data: string): T {
    if (!data) {
      throw new Error('invalid data: ' + data);
    }

    if (this.useCrypt) {
      return JSON.parse(decodeURIComponent(atob(data)));
    } else {
      return JSON.parse(data) as T;
    }
  }
}
