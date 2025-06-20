import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: false
})
export class ResetPasswordComponent implements OnInit {
  token: string | null = null;
  newPassword = '';
  passwordError: string | null = null;
  message: string | null = null;
  isSubmitting = false;
passwordFieldType: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  onSubmit(): void {
    if (!this.token || !this.newPassword) return;

    this.isSubmitting = true;
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.message = response.message;
        alert('Password reset successful! Redirecting to login...');
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.message = err.message;
      }
    }).add(() => {
      this.isSubmitting = false;
    });
  }

  validatePassword(): boolean {
    this.passwordError = null;
    if (!this.newPassword) {
      this.passwordError = 'Password is required.';
      return false;
    } else if (this.newPassword.length < 6) {
      this.passwordError = 'Password must be at least 6 characters long.';
      return false;
    }
    return true;
  }

  togglePasswordVisibility(show: boolean): void {
    this.passwordFieldType = show ? 'text' : 'password';
  }
}