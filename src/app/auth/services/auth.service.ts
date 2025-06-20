import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

// --- Interfaces for Backend Communication ---

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string[];
  otp?: string;
}

interface RegisterResponse {
  message: string;
  userId: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  message: string;
  jwtToken: string; // Changed from 'token' to 'jwtToken'
  username: string;
  roles: string[];
}

// *** MODIFIED: BackendErrorResponse interface - more flexible ***
interface BackendErrorResponse {
  message?: string; // Backend might send 'message'
  error?: string;   // Or backend might send 'error'
  // Add other common fields if your backend sends them, e.g., 'details', 'errors' (for validation errors)
}

interface MessageResponse {
  message: string;
}

interface CurrentUser {
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private backendBaseUrl = 'http://localhost:8081/api/auth/public';

  private currentUserSubject: BehaviorSubject<CurrentUser | null>;
  public currentUser: Observable<CurrentUser | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    let initialUser: CurrentUser | null = null;
    if (isPlatformBrowser(this.platformId)) {
      const storedToken = localStorage.getItem('authToken');
      const storedUserString = localStorage.getItem('currentUser');

      if (storedToken && storedUserString && !this.isTokenExpired(storedToken)) {
        try {
          initialUser = JSON.parse(storedUserString);
        } catch (e) {
          console.error("AuthService: Error parsing stored user data from localStorage", e);
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          initialUser = null;
        }
      } else if (storedToken || storedUserString) {
        console.warn("AuthService: Token expired or inconsistent localStorage state detected, clearing both.");
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    }
    this.currentUserSubject = new BehaviorSubject<CurrentUser | null>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  public getAuthToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      return token && !this.isTokenExpired(token) ? token : null;
    }
    return null;
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    const registerUrl = `${this.backendBaseUrl}/signup`;
    console.log('AuthService: Sending registration request to backend:', userData);

    return this.http.post<RegisterResponse>(registerUrl, userData)
      .pipe(
        tap(response => console.log('AuthService: Registration successful on frontend:', response)),
        catchError(this.handleError)
      );
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const loginUrl = `${this.backendBaseUrl}/signin`;
    console.log('AuthService: Sending login request to backend:', credentials);

    return this.http.post<LoginResponse>(loginUrl, credentials)
      .pipe(
        tap(response => {
          console.log('AuthService: Login successful on frontend:', response);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('authToken', response.jwtToken);

            const user: CurrentUser = {
              username: response.username,
              roles: response.roles
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            console.log('AuthService: localStorage updated, currentUserSubject emitted:', user);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    console.log('AuthService: Initiating logout...');
    if (isPlatformBrowser(this.platformId)) {
      console.log('AuthService: Clearing localStorage (authToken and currentUser).');
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    console.log('AuthService: currentUserSubject set to null, redirecting to login.');
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    const isBrowser = isPlatformBrowser(this.platformId);
    const storedToken = isBrowser ? localStorage.getItem('authToken') : null;
    const currentUser = this.currentUserSubject.value;
    const tokenExpired = storedToken ? this.isTokenExpired(storedToken) : true;

    console.log('AuthService.isLoggedIn() Check:');
    console.log('  isPlatformBrowser:', isBrowser);
    console.log('  localStorage authToken:', storedToken ? storedToken.substring(0, 15) + '...' : null);
    console.log('  currentUserValue:', currentUser);
    console.log('  Token Expired (client-side check):', tokenExpired);

    const loggedIn = (isBrowser && !!storedToken && !tokenExpired && !!currentUser) ||
                     (!isBrowser && !!currentUser);

    console.log('  Result: Logged in?', loggedIn);
    return loggedIn;
  }

  hasRole(allowedRoles: string[]): boolean {
    const user = this.currentUserValue;
    if (!user || !user.roles || user.roles.length === 0) {
      console.warn('AuthService.hasRole: User or roles not found. Returning false.', user);
      return false;
    }
    const hasRequired = user.roles.some(role => allowedRoles.includes(role));
    console.log(`AuthService.hasRole: User roles [${user.roles.join(', ')}] vs Allowed roles [${allowedRoles.join(', ')}]. Has required: ${hasRequired}`);
    return hasRequired;
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = decodeURIComponent(atob(payload).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(decoded);
    } catch (e) {
      console.error('AuthService: Error decoding token:', e);
      return null;
    }
  }

  public isTokenExpired(token: string, offsetSeconds: number = 0): boolean {
    if (!token) {
      return true;
    }
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      console.warn('AuthService: Token has no expiration (exp) claim or is invalid. Treating as expired.');
      return true;
    }

    const expirationTime = decoded.exp * 1000;
    const now = new Date().getTime();
    const expiryThreshold = expirationTime - (offsetSeconds * 1000);

    const expired = now >= expiryThreshold;
    console.log(`AuthService: Token expiry check - Now: ${new Date(now).toISOString()}, Expiration: ${new Date(expirationTime).toISOString()}, Threshold: ${new Date(expiryThreshold).toISOString()}. Expired: ${expired}`);
    return expired;
  }

  // *** MODIFIED handleError METHOD ***
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    console.error('AuthService: API Call Failed. Raw Error:', error); // Log the full error object

    if (error.error instanceof ErrorEvent) {
      // Client-side network error
      errorMessage = `Network/Client Error: ${error.error.message}`;
    } else {
      // Backend error (HTTP status code was not 2xx)
      // Try to parse the backend's specific error message from the response body
      if (typeof error.error === 'object' && error.error !== null) {
        const backendError = error.error as BackendErrorResponse;
        if (backendError.message) {
          errorMessage = `Backend Error (${error.status}): ${backendError.message}`;
        } else if (backendError.error) { // Fallback to 'error' field if 'message' is not present
          errorMessage = `Backend Error (${error.status}): ${backendError.error}`;
        } else {
          // If neither 'message' nor 'error' is present in the object, use generic message
          errorMessage = `Server Error (${error.status}): ${error.statusText || 'Unknown backend error.'}`;
        }
      } else if (typeof error.error === 'string') {
        // If the error body is a plain string
        errorMessage = `Server Error (${error.status}): ${error.error}`;
      } else {
        // Fallback to Angular's HttpErrorResponse message
        errorMessage = `Server Error (${error.status}): ${error.message || 'No specific error message from backend.'}`;
      }

      if (error.status === 0) {
        errorMessage = 'Connection refused. Is the backend server running and accessible at ' + this.backendBaseUrl + '?';
      }
    }

    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }


  forgotPassword(email: string): Observable<MessageResponse> {
    const forgotPasswordUrl = `${this.backendBaseUrl}/forgot-password`;
    const params = new HttpParams().set('email', email);
    return this.http.post<MessageResponse>(forgotPasswordUrl, {}, { params }).pipe(
      tap(response => console.log('AuthService: Forgot password request sent:', response)),
      catchError(this.handleError)
    );
  }

  resetPassword(token: string, newPassword: string): Observable<MessageResponse> {
    const resetPasswordUrl = `${this.backendBaseUrl}/reset-password`;
    const body = { token, newPassword };
    return this.http.post<MessageResponse>(resetPasswordUrl, body).pipe(
      tap(response => console.log('AuthService: Password reset successful:', response)),
      catchError(this.handleError)
    );
  }

}