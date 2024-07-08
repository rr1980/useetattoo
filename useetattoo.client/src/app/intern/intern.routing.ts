import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternComponent } from './intern.component';
import { InternHomeComponent } from './intern-home/intern-home.component';
import { InternNewDeclarationComponent } from './intern-new-declaration/intern-new-declaration.component';
import { InternHome2Component } from './intern-home2/intern-home2.component';
import { InternHome3Component } from './intern-home3/intern-home3.component';

const routes: Routes = [
  {
    path: '',
    component: InternComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: InternHome3Component,
      },
      {
        path: 'newDeclaration',
        component: InternNewDeclarationComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InternRoutingModule {}
