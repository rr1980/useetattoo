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
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  post<T>(endPoint: string, data: any = null): Observable<T> {
    return this.http.post<any>(endPoint, data);
  }

  get<T>(endPoint: string, data: any = null): Observable<T> {
    return this.http.get<any>(endPoint);
  }

  public getRequestHeaders(
    responseType: any = null
  ): { headers: HttpHeaders; responseType: any } | { headers: HttpHeaders } {
    var headers;

    const token = this.storageService.getFromSession<string>('token');
    headers = new HttpHeaders({
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
  ) {
    var err = false;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', path, true);
    xhr.responseType = 'blob';
    xhr.withCredentials = true;

    const token = this.storageService.getFromSession<string>('token');
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

        var _fileName = this.getFilename(xhr) || fileName;

        if (navigator.appVersion.toString().indexOf('.NET') > 0) {
          // window.navigator.msSaveBlob(xhr.response, _fileName);
        } else {
          var _url = window.URL || window.webkitURL;
          var src = _url.createObjectURL(xhr.response);

          var link = document.createElement('a');
          link.href = src;
          link.download = _fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => {
            window.URL.revokeObjectURL(src);
          }, 800);
        }
      } else {
        err = true;
        xhr.response.text().then((x: any) => {
          throw x;
        });
      }
    };

    xhr.send(JSON.stringify(data));
  }

  getFilename(xhr: any) {
    var disposition = xhr.getResponseHeader('Content-Disposition');
    var dispositionSplits = disposition.split(';');
    if (dispositionSplits && dispositionSplits.length === 3) {
      if (dispositionSplits[0] === 'attachment') {
        var fn = dispositionSplits[2].split("filename*=UTF-8''");
        if (fn && fn.length === 2) {
          var dfn = decodeURI(fn[1]);
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
  ) {
    var _headers = this.getRequestHeaders();
    var uploadReq = new HttpRequest('POST', url, input, {
      reportProgress: false,
      headers: _headers.headers,
    });

    this.http.request(uploadReq).subscribe(
      (event) => {
        if (event.type === HttpEventType.Response) {
          var response = event.body as T;
          if (cb) {
            cb(response);
          }
        }
      },
      (err) => {
        if (errCb) {
          errCb(err);
        } else {
          throw new Error(err.error.msg);
        }
      }
    );
  }
}
