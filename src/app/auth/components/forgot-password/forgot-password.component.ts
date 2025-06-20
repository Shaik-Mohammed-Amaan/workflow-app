import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone: false
})
export class ForgotPasswordComponent {
  email = '';
  emailError: string | null = null;
  message: string | null = null;
  isSubmitting = false;

  constructor(private authService: AuthService, private router: Router) {}

  validateEmail(): boolean {
    // Email validation logic
    return true;
  }

  onSubmit(): void {
    if (!this.validateEmail()) return;

    this.isSubmitting = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.message = response.message;
      },
      error: (err) => {
        this.message = err.message;
      }
    }).add(() => {
      this.isSubmitting = false;
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}