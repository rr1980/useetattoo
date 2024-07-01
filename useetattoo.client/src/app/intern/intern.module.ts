import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternRoutingModule } from './intern.routing';
import { InternComponent } from './intern.component';
import { InternHomeComponent } from './intern-home/intern-home.component';

@NgModule({
  imports: [
    CommonModule,
    InternRoutingModule
  ],
  declarations: [InternComponent, InternHomeComponent]
})
export class InternModule { }
