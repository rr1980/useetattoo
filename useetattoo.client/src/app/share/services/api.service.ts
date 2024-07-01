import { Injectable, Inject } from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { StorageService } from './storage.service';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class ApiService {
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _http: HttpClient,
    private _storageService: StorageService
  ) {}

  public post<T>(endPoint: string, data: any = null): Observable<T> {
    return this._http.post<any>(endPoint, data);
  }

  public get<T>(endPoint: string, data: any = null): Observable<T> {
    return this._http.get<any>(endPoint);
  }

  public getRequestHeaders(
    responseType: any = null
  ): { headers: HttpHeaders; responseType: any } | { headers: HttpHeaders } {
    const token = this._storageService.getFromSession<string>('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
    });

    if (responseType === null) {
      return {
        headers: headers,
      };
    } else {
      return {
        headers: headers,
        responseType: responseType,
      };
    }
  }

  public postDownload(
    path: string,
    fileName: string,
    data: any,
    cb: (err: any) => void = (err: any) => {}
  ): void {
    let err = false;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', path, true);
    xhr.responseType = 'blob';
    xhr.withCredentials = true;

    const token = this._storageService.getFromSession<string>('token');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

    xhr.onloadend = (a) => {
      if (cb !== null) {
        cb(err);
      }
    };

    xhr.onload = (e) => {
      if (xhr.status === 200) {
        if (xhr.response.size < 1) {
          return;
        }

        const _fileName = this._getFilename(xhr) || fileName;

        const _url = window.URL || window.webkitURL;
        const src = _url.createObjectURL(xhr.response);

        const link = document.createElement('a');
        link.href = src;
        link.download = _fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
          window.URL.revokeObjectURL(src);
        }, 800);
      } else {
        err = true;
        xhr.response.text().then((x: any) => {
          throw x;
        });
      }
    };

    xhr.send(JSON.stringify(data));
  }

  private _getFilename(xhr: any): string | null {
    const disposition = xhr.getResponseHeader('Content-Disposition');
    const dispositionSplits = disposition.split(';');
    if (dispositionSplits && dispositionSplits.length === 3) {
      if (dispositionSplits[0] === 'attachment') {
        const fn = dispositionSplits[2].split("filename*=UTF-8''");
        if (fn && fn.length === 2) {
          const dfn = decodeURI(fn[1]);
          return dfn;
        }
      }
    }

    return null;
  }

  public upload<T>(
    url: string,
    input: FormData,
    cb: (data: T) => void,
    errCb: (err: any) => void = (err: any) => {}
  ): void {
    const _headers = this.getRequestHeaders();
    const uploadReq = new HttpRequest('POST', url, input, {
      reportProgress: false,
      headers: _headers.headers,
    });

    this._http.request(uploadReq).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          const response = event.body as T;
          if (cb) {
            cb(response);
          }
        }
      },
      error: (err) => {
        if (errCb) {
          errCb(err);
        } else {
          throw new Error(err.error.msg);
        }
      },
    });
  }
}
