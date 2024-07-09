import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { EventService } from '../../services/event.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
})
export class SignatureComponent implements OnInit {
  protected _isInited: boolean = false;

  @ViewChild('signatureCanvas', { static: false })
  private _signatureCanvas?: ElementRef<HTMLCanvasElement>;
  private _signaturePad?: SignaturePad;

  constructor(private _eventService: EventService) {
    this._resizeCanvas = this._resizeCanvas.bind(this);
    this._eventService.on('onThemeChange', (theme: any): void => {
      this._rePaint(theme);
    });
  }

  public ngOnInit(): void {
    this._isInited = true;
    setTimeout(() => {
      this._signaturePad = new SignaturePad(
        this._signatureCanvas!.nativeElement,
        {
          // minWidth: 5,
          // maxWidth: 10,
          penColor: 'rgb(0, 0, 0)',
        }
      );

      this._eventService.getLasValue('onThemeChange', (theme: any): void => {
        if (this._isInited && this._signaturePad) {
          this._signaturePad!.penColor =
            theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
        }
      });

      window.addEventListener('resize', this._resizeCanvas);
      this._resizeCanvas();
    }, 0);
  }

  public isValidate(): boolean {
    if (this._signaturePad) {
      if (this._signaturePad.isEmpty()) {
        return false;
      } else {
        const data = this._signaturePad!.toData();
        if (data && data.length > 0) {
          let _counter: number = 0;
          data.forEach((d: any) => {
            if (d.points && d.points.length > 0) {
              _counter += d.points.length;
            }
          });
          if (_counter > 10) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  public getSignature(data: any): any | null {
    if (this._signaturePad && this.isValidate()) {
      const _date = new Date();
      const result: any = {
        hash: null,
        date: _date,
        points: JSON.minify(JSON.stringify(this._signaturePad.toData())),
        image: btoa(this._signaturePad.toDataURL().split(',')[1]),
      };

      const _s =
        _date.toISOString() +
        '|' +
        result.data +
        '|' +
        result.points +
        '|' +
        result.image;
      result.hash = CryptoJS.SHA256(_s).toString();

      console.debug('result', result);

      return result;
    } else {
      return null;
    }
  }

  private _resizeCanvas(): void {
    if (this._signatureCanvas) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      this._signatureCanvas.nativeElement.width =
        this._signatureCanvas.nativeElement.offsetWidth * ratio;
      this._signatureCanvas.nativeElement.height =
        this._signatureCanvas.nativeElement.offsetHeight * ratio;
      this._signatureCanvas.nativeElement.getContext('2d')!.scale(ratio, ratio);
      this._rePaint();
    }
  }

  private _rePaint(theme: any = null): void {
    if (theme === null) {
      theme =
        this._signaturePad!.penColor === 'rgb(255, 255, 255)'
          ? 'dark'
          : 'light';
    }
    if (this._isInited && this._signaturePad) {
      const data = this._signaturePad.toData();
      if (data && data.length > 0) {
        this._signaturePad!.penColor =
          theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
        data.forEach((d: any) => {
          d.penColor = theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
        });

        this._signaturePad.fromData(data, { clear: true });
      } else {
        this._signaturePad!.penColor =
          theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
      }
    }
  }

  // protected _onOkClick(e: any): void {
  //   const data = this._signaturePad!.toData();
  //   // console.debug('data', data);
  //   console.debug('data', this._signaturePad);
  // }
}
