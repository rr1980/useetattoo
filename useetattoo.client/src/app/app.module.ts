import {
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { StorageService } from './share/services/storage.service';
import { AuthService } from './share/services/auth.service';
import { ApiService } from './share/services/api.service';
import { AuthGuard } from './share/guards/auth.guard';
import { authInterceptorProvider } from './share/interceptors/auth.interceptor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [BrowserModule, CommonModule, FormsModule, AppRoutingModule],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: 'de' },
    AuthGuard,
    StorageService,
    authInterceptorProvider,
    ApiService,
    AuthService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
