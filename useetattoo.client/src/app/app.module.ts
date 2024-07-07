import {
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './share/components/header/header.component';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from './share/helper/datePicker.formater';
import { SpecialErrorHandler } from './share/handler/error.handler';
import { ModalService } from './share/services/modal.service';

@NgModule({
  declarations: [AppComponent, HeaderComponent, LoginComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: 'de-DE' },
    ModalService,
    { provide: ErrorHandler, useClass: SpecialErrorHandler },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    AuthGuard,
    StorageService,
    authInterceptorProvider,
    ApiService,
    AuthService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
