import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { InternRoutingModule } from './intern.routing';
import { InternComponent } from './intern.component';
import { InternHomeComponent } from './intern-home/intern-home.component';
import { InternNewDeclarationComponent } from './intern-new-declaration/intern-new-declaration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SignatureComponent } from '../share/components/signature/signature.component';
import { NgbdSortableHeaderDirective } from '../share/directives/sortable.directive';
import { DeclarationService } from './intern-home/intern-home.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbHighlight,
    NgbPaginationModule,
    InternRoutingModule,
  ],
  declarations: [
    InternComponent,
    InternHomeComponent,
    InternNewDeclarationComponent,
    SignatureComponent,
    NgbdSortableHeaderDirective
  ],
  providers: [DeclarationService, DecimalPipe],
})
export class InternModule {}
