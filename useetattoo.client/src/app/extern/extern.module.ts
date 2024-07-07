import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternComponent } from './extern.component';
import { ExternRoutingModule } from './extern.routing';
import { ExternHomeComponent } from './extern-home/extern-home.component';
@NgModule({
  imports: [CommonModule, ExternRoutingModule],
  declarations: [ExternComponent, ExternHomeComponent],
})
export class ExternModule {}
