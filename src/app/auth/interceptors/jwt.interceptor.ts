// src/app/interceptors/jwt.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // Adjust path
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token from the service
    const authToken = this.authService.getAuthToken();

    // If we have a token, clone the request and add it to the headers
    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    // Pass the cloned request to the next handler and catch errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle specific HTTP errors like 401 (Unauthorized) or 403 (Forbidden)
        if (error.status === 401 || error.status === 403) {
          console.error('JwtInterceptor: Token invalid or expired. Logging out user.', error);
          this.authService.logout(); // Use the logout method from AuthService
          // Optionally, redirect to login page if not already handled by authService.logout()
          // this.router.navigate(['/auth/login']);
        }
        // Re-throw the error to be handled by the subscriber (e.g., component)
        return throwError(() => error);
      })
    );
  }
}