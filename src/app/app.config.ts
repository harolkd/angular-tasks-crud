import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';  // ← añadir withInterceptors
import { routes } from './app.routes';
import { Interceptor } from './auth/interceptors/interceptor';  // ← importar

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([Interceptor]))  // ← registrar
  ]
};
