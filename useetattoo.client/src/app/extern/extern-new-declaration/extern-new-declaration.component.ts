import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-extern-new-declaration',
  templateUrl: './extern-new-declaration.component.html',
  styleUrls: ['./extern-new-declaration.component.scss'],
})
export class ExternNewDeclarationComponent {
  protected get _formControls(): any {
    return this._form.controls;
  }

  protected _submitted: boolean = false;

  protected _form: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    vorname: new FormControl(null, Validators.required),
    anrede: new FormControl(null, Validators.required),
    geburtsdatum: new FormControl(
      // { day: 1, month: 7, year: 1980 },
      null,
      Validators.required
    ),
    geborenIn: new FormControl(null, Validators.required),
    strasse: new FormControl(null, Validators.required),
    hausnummer: new FormControl(null, Validators.required),
    plz: new FormControl(null, Validators.required),
    ort: new FormControl(null, Validators.required),
  });

  constructor() {}

  protected _onClickSubmit(e: any): void {
    this._submitted = true;
    console.debug('Submit value', this._form.value);

    if (this._form.valid) {
      console.debug('Submit valid');
    }
  }
}
