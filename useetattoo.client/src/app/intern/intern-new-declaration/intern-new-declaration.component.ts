import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../share/services/api.service';
import { RouteKeys } from '../../share/helper/route-keys.helper';
import { SignatureComponent } from '../../share/components/signature/signature.component';
import { DxFormComponent } from 'devextreme-angular/ui/form';

@Component({
  selector: 'app-intern-new-declaration',
  templateUrl: './intern-new-declaration.component.html',
  styleUrls: ['./intern-new-declaration.component.scss'],
})
export class InternNewDeclarationComponent {
  @ViewChild('declatationForm', { static: false })
  protected _declatationForm?: DxFormComponent;

  @ViewChild('signature', { static: false })
  private _signature?: SignatureComponent;

  protected _submitted: boolean = false;

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

  constructor(private _apiService: ApiService) {
    this._onClickSubmit = this._onClickSubmit.bind(this);
  }

  protected _onClickSubmit(e: any): void {
    if (!this._signature?.isValidate()) {
      return;
    }

    this._submitted = true;

    if (this._declatationForm) {
      if (this._declatationForm.instance.validate().isValid) {
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
