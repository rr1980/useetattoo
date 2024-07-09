import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternRoutingModule } from './intern.routing';
import { InternComponent } from './intern.component';
import { InternNewDeclarationComponent } from './intern-new-declaration/intern-new-declaration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignatureComponent } from '../share/components/signature/signature.component';
import { NgbdSortableHeaderDirective } from '../share/directives/sortable.directive';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InternHomeComponent } from './intern-home/intern-home.component';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InternRoutingModule,
    ScrollingModule,
    DxDataGridModule
  ],
  declarations: [
    InternComponent,
    InternHomeComponent,
    InternNewDeclarationComponent,
    SignatureComponent,
    NgbdSortableHeaderDirective
  ],
  providers: [],
})
export class InternModule {}
