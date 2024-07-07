import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternComponent } from './extern.component';
import { ExternHomeComponent } from './extern-home/extern-home.component';

const routes: Routes = [
  {
    path: '',
    component: ExternComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: ExternHomeComponent,
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
export class ExternRoutingModule {}
