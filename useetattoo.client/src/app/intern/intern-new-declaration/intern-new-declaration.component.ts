import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ApiService } from '../../share/services/api.service';
import { RouteKeys } from '../../share/helper/route-keys.helper';

@Component({
  selector: 'app-intern-new-declaration',
  templateUrl: './intern-new-declaration.component.html',
  styleUrls: ['./intern-new-declaration.component.scss'],
})
export class InternNewDeclarationComponent {
  protected get _formControls(): any {
    return this._form.controls;
  }

  protected _submitted: boolean = false;

  protected _form: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('Riesner', Validators.required),
    vorname: new FormControl('Rene', Validators.required),
    anrede: new FormControl('Herr', Validators.required),
    geburtsdatum: new FormControl(
      { day: 1, month: 7, year: 1980 },
      // null,
      Validators.required
    ),
    geborenIn: new FormControl('Altdöbern', Validators.required),
    strasse: new FormControl('Am Annatal', Validators.required),
    hausnummer: new FormControl('11a', Validators.required),
    plz: new FormControl('15344', Validators.required),
    ort: new FormControl('Strausberg', Validators.required),
  });

  constructor(private _apiService: ApiService) {}

  protected _onClickSubmit(e: any): void {
    this._submitted = true;

    if (this._form.valid) {
      console.debug('Submit value', this._form.value);
      this._apiService
        .post<any>(RouteKeys.Intern.Declaration.add, this._form.value)
        .subscribe({
          next: (response: any) => {
            console.debug('Response', response);
          },
          error: (err: any) => {
            throw err;
          },
        });
    }
  }


}
