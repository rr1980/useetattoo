import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternComponent } from './intern.component';
import { InternHomeComponent } from './intern-home/intern-home.component';

const routes: Routes = [
  {
    path: '',
    component: InternComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: InternHomeComponent,
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
