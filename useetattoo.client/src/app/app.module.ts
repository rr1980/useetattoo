import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ErrorHandler, LOCALE_ID, NgModule, isDevMode } from '@angular/core';
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
import { SpecialErrorHandler } from './share/handler/error.handler';
import { ModalService } from './share/services/modal.service';
import { EventService } from './share/services/event.service';

import {InternModule} from './intern/intern.module';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { DxSwitchModule } from 'devextreme-angular/ui/switch';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent, HeaderComponent, LoginComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    DxFormModule,
    DxLoadIndicatorModule,
    DxButtonModule,
    DxSwitchModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: 'de-DE' },
    ModalService,
    { provide: ErrorHandler, useClass: SpecialErrorHandler },
    AuthGuard,
    StorageService,
    authInterceptorProvider,
    ApiService,
    AuthService,
    EventService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
