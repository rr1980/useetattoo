import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternComponent } from './extern.component';
import { ExternRoutingModule } from './extern.routing';
import { ExternHomeComponent } from './extern-home/extern-home.component';
import { ExternNewDeclarationComponent } from './extern-new-declaration/extern-new-declaration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExternRoutingModule,
    NgbDatepickerModule
  ],
  declarations: [ExternComponent, ExternHomeComponent, ExternNewDeclarationComponent]
})
export class ExternModule { }
