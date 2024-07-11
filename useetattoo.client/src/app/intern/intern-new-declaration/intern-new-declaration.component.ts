import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../share/services/api.service';
import { RouteKeys } from '../../share/helper/route-keys.helper';
import { SignatureComponent } from '../../share/components/signature/signature.component';
import { DxFormComponent } from 'devextreme-angular/ui/form';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-intern-new-declaration',
  templateUrl: './intern-new-declaration.component.html',
  styleUrls: ['./intern-new-declaration.component.scss'],
})
export class InternNewDeclarationComponent implements OnInit {
  @ViewChild('declatationForm', { static: false })
  private _declatationForm?: DxFormComponent;

  @ViewChild('signature', { static: false })
  private _signature?: SignatureComponent;

  protected _id: number | null | undefined;
  protected _isInited: boolean = false;
  protected _submitted: boolean = false;
  protected _errorText: string = '';

  protected _formData: any = {
    vorname: 'Rene',
    name: 'Riesner',
    geschlecht: 'männlich',
    geburtsdatum: null,
    geborenIn: 'Altdöbern',
    strasse: 'Am Annatal',
    hausnummer: '11a',
    plz: '15344',
    ort: 'Strausberg',
  };

  protected _datasource_geschlecht: string[] = [
    'männlich',
    'weiblich',
    'divers',
  ];

  protected _colCountByScreen: any = {
    md: 4,
    sm: 2,
  };

  protected _screen = (width: number): string => (width < 720 ? 'sm' : 'md');

  protected _imageData?: string;

  constructor(
    private _apiService: ApiService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._onClickSubmit = this._onClickSubmit.bind(this);
  }

  public ngOnInit(): void {
    this._route.paramMap.subscribe((params): void => {
      const _id = params.get('id');
      if (_id) {
        this._id = parseInt(_id);
        this._load(
          (response: any): void => {
            if (response) {
              this._formData = response;
              this._imageData = response.signature?.image
                ? 'data:image/png;base64,' + atob(response.signature?.image)
                : undefined;
            } else {
              this._errorText = 'Deklaration nicht gefunden.';
            }
            this._isInited = true;
          },
          (err: any): void => {
            this._errorText = 'Ein Fehler ist aufgetreten.';
            this._isInited = true;
            throw err;
          }
        );
      } else {
        this._isInited = true;
      }
    });
  }
  private _load(cb: (response: any) => void, errCb: (err: any) => void): void {
    if (!this._id) {
      errCb('No ID found!');
      return;
    }
    this._apiService
      .post<any>(RouteKeys.Intern.Declaration.get, { id: this._id })
      .subscribe({
        next: (response: any) => {
          console.debug('Response', response);
          cb(response || null);
        },
        error: (err: any) => {
          errCb(err);
        },
      });
  }

  protected _onClickSubmit(e: any): void {
    this._errorText = '';
    if (!this._signature?.isValidate()) {
      this._errorText = 'Bitte Unterschreiben Sie.';
      return;
    }

    if (this._declatationForm) {
      if (this._declatationForm.instance.validate().isValid) {
        this._submitted = true;

        const _signature = this._signature?.getSignature(this._formData);
        const _toSend: any = JSON.parse(JSON.stringify(this._formData));
        _toSend.signature = _signature;

        console.debug('Submit value', _toSend);
        this._apiService
          .post<any>(RouteKeys.Intern.Declaration.add, _toSend)
          .subscribe({
            next: (response: any) => {
              console.debug('Response', response);
              this._submitted = false;
              // this._router.navigate(['intern/home']);
            },
            error: (err: any) => {
              this._submitted = false;
              throw err;
            },
          });
      }
    }
  }
}
