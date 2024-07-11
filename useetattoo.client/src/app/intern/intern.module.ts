import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternRoutingModule } from './intern.routing';
import { InternComponent } from './intern.component';
import { InternNewDeclarationComponent } from './intern-new-declaration/intern-new-declaration.component';
import { SignatureComponent } from '../share/components/signature/signature.component';
import { InternHomeComponent } from './intern-home/intern-home.component';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxRadioGroupModule } from 'devextreme-angular/ui/radio-group';
import { DxButtonModule } from 'devextreme-angular/ui/button';

@NgModule({
  imports: [
    CommonModule,
    DxCheckBoxModule,
    DxFormModule,
    DxDataGridModule,
    DxRadioGroupModule,
    DxButtonModule,
    InternRoutingModule,
  ],
  declarations: [
    InternComponent,
    InternHomeComponent,
    InternNewDeclarationComponent,
    SignatureComponent,
  ],
  providers: [],
})
export class InternModule {}
