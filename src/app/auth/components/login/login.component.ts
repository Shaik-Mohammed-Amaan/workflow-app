import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginIdentifier: string = '';
  password: string = '';

  loginIdentifierError: string | null = null;
  passwordError: string | null = null;

  loginMessage: string | null = null;
  isLoggingIn: boolean = false;

  @Output() goToRegister = new EventEmitter<void>();

  passwordFieldType: string = 'password';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Check login status on component initialization
    // If already logged in, redirect to dashboard.
    // This part is for when the user visits the login page while already authenticated.
    if (this.authService.isLoggedIn()) {
      console.log('LoginComponent: User already logged in, attempting immediate dashboard redirect.');
      this.redirectToDashboard();
    }
  }

  ngOnInit(): void {
    // No specific initialization needed here for this fix
  }

  private clearErrors(): void {
    this.loginIdentifierError = null;
    this.passwordError = null;
    this.loginMessage = null;
  }

  togglePasswordVisibility(show: boolean): void {
    this.passwordFieldType = show ? 'text' : 'password';
  }

  validateLoginIdentifier(): boolean {
    this.loginIdentifierError = null;
    if (!this.loginIdentifier.trim()) {
      this.loginIdentifierError = 'Email or Username is required.';
      return false;
    }
    return true;
  }

  validatePassword(): boolean {
    this.passwordError = null;
    if (!this.password) {
      this.passwordError = 'Password is required.';
      return false;
    } else if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters long.';
      return false;
    }
    return true;
  }

  private validateFormOnSubmit(): boolean {
    let isValid = true;
    isValid = this.validateLoginIdentifier() && isValid;
    isValid = this.validatePassword() && isValid;
    return isValid;
  }

  onLogin(): void {
    this.clearErrors();
    this.isLoggingIn = false;

    if (!this.validateFormOnSubmit()) {
      this.loginMessage = 'Please correct the errors above before logging in.';
      return;
    }

    this.isLoggingIn = true;

    const credentials = {
      username: this.loginIdentifier.trim(),
      password: this.password
    };

    this.authService.login(credentials).pipe(first())
      .subscribe({
        next: (response) => {
          this.loginMessage = response.message || 'Login successful!';
          console.log('Login Success (AuthService returned):', response);
          //alert(this.loginMessage + ' Token received: ' + response.jwtToken.substring(0, 15) + '...');
          this.resetForm();

          // Introduce a small delay before redirection
          // This allows Angular's change detection to propagate the new auth state
          console.log('LoginComponent: Successfully logged in, attempting delayed dashboard redirect.');
          setTimeout(() => {
            this.redirectToDashboard();
          }, 50); // Small delay of 50 milliseconds
        },
        error: (err: Error) => {
          this.loginMessage =  'Login failed. Invalid credentials or server error.';
          console.error('Login Error:', err);
          alert(this.loginMessage);
        }
      }).add(() => {
        this.isLoggingIn = false;
      });
  }

  private resetForm(): void {
    this.loginIdentifier = '';
    this.password = '';
    this.clearErrors();
    this.loginMessage = null;
  }

  onForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  onRegisterLinkClick(): void {
    console.log('Register link clicked from Login page!');
    this.router.navigate(['auth/register']);
  }

  private redirectToDashboard(): void {
    const user = this.authService.currentUserValue;
    console.log('redirectToDashboard called. Current User State:', user);

    if (user && user.roles && user.roles.length > 0) {
      if (user.roles.includes('ROLE_PRODUCTOWNER')) {
        console.log('Redirecting to Product Owner Dashboard');
        this.router.navigate(['/dashboard/product-owner']);
      } else if (user.roles.includes('ROLE_SCRUMMASTER')) {
        console.log('Redirecting to Scrum Master Dashboard');
        this.router.navigate(['/dashboard/scrum-master']);
      } else if (user.roles.includes('ROLE_SDETENGINEER')) {
        console.log('Redirecting to SDET Engineer Dashboard');
        this.router.navigate(['/dashboard/sdet-engineer']);
      } else {
        console.log('Redirecting to Default Dashboard (no specific role match)');
        this.router.navigate(['/dashboard/default']);
      }
    } else {
      console.warn('User logged in but no roles found or roles array is empty, redirecting to default dashboard.');
      this.router.navigate(['/dashboard/default']);
    }
  }
}