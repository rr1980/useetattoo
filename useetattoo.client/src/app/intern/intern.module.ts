import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternRoutingModule } from './intern.routing';
import { InternComponent } from './intern.component';
import { InternHomeComponent } from './intern-home/intern-home.component';
import { InternNewDeclarationComponent } from './intern-new-declaration/intern-new-declaration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SignatureComponent } from '../share/components/signature/signature.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    InternRoutingModule,
  ],
  declarations: [
    InternComponent,
    InternHomeComponent,
    InternNewDeclarationComponent,
    SignatureComponent
  ],
})
export class InternModule {}
