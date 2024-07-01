import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './share/guards/auth.guard';



const routes: Routes = [
  {path: '', redirectTo: 'extern', pathMatch: 'full'},

  {path: 'login', component: LoginComponent},
  {
    path: 'intern',
    loadChildren: (): any => import('./intern/intern.module').then((m) => m.InternModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'extern',
    loadChildren: (): any => import('./extern/extern.module').then((m) => m.ExternModule)
  },
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
