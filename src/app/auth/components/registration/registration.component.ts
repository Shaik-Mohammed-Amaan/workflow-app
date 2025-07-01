import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'], // This should be empty for Tailwind
  standalone: false
})
export class RegistrationComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'productOwner'; // Default selected role (Product Owner)
  projectCode: string = '';

  usernameError: string | null = null;
  emailError: string | null = null;
  passwordError: string | null = null;
  confirmPasswordError: string | null = null;
  userRoleError: string | null = null;
  projectCodeError: string | null = null;

  registrationMessage: string | null = null;
  isRegistering: boolean = false;

  @Output() goToLogin = new EventEmitter<void>();

  // NEW: Properties to control password input types
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit(): void { }

  private clearErrors(): void {
    this.usernameError = null;
    this.emailError = null;
    this.passwordError = null;
    this.confirmPasswordError = null;
    this.userRoleError = null;
    this.projectCodeError = null;
    this.registrationMessage = null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // NEW: Toggle password visibility for the password field
  togglePasswordVisibility(show: boolean): void {
    this.passwordFieldType = show ? 'text' : 'password';
  }

  // NEW: Toggle password visibility for the confirm password field
  toggleConfirmPasswordVisibility(show: boolean): void {
    this.confirmPasswordFieldType = show ? 'text' : 'password';
  }

  validateUsername(): boolean {
    if (!this.username) {
      this.usernameError = 'Username is required';
      return false;
    }

    // Check if username contains only alphabets
    if (!/^[a-zA-Z]+$/.test(this.username)) {
      this.usernameError = 'Username should contain only alphabets';
      return false;
    }

    this.usernameError = '';
    return true;
  }

  onUsernameKeyPress(event: KeyboardEvent): boolean {
    const pattern = /[a-zA-Z]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  validateEmail(): boolean {
    this.emailError = null;
    if (!this.email.trim()) {
      this.emailError = 'Email address is required.';
      return false;
    } else if (!this.isValidEmail(this.email.trim())) {
      this.emailError = 'Please enter a valid email address (e.g., user@domain.com).';
      return false;
    }
    return true;
  }

  validatePassword(): boolean {
    this.passwordError = null;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!this.password) {
      this.passwordError = 'Password is required.';
      return false;
    } else if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters long.';
      return false;
    } else if (!passwordRegex.test(this.password)) {
        this.passwordError = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).';
        return false;
    }
    return true;
  }

  validateConfirmPassword(): boolean {
    this.confirmPasswordError = null;
    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Confirm password is required.';
      return false;
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match.';
      return false;
    }
    return true;
  }

  validateUserRole(): boolean {
    this.userRoleError = null;
    if (!this.role) {
      this.userRoleError = 'Please select a role.';
      return false;
    }
    return true;
  }

  validateProjectCode(): boolean {
    this.projectCodeError = null;
    if (this.role === 'Scrum Master' || this.role === 'SDET Engineer') {
      if (!this.projectCode.trim()) {
        this.projectCodeError = 'Project Code is required for this role.';
        return false;
      } else if (!/^[A-Za-z0-9-]+$/.test(this.projectCode.trim())) {
        this.projectCodeError = 'Project Code can only contain letters, numbers, and hyphens.';
        return false;
      }
    }
    return true;
  }

  onRoleChange(): void {
    if (this.role !== 'Scrum Master' && this.role !== 'SDET Engineer') {
      this.projectCode = '';
      this.projectCodeError = null;
    } else {
        this.validateProjectCode();
    }
  }

  private validateFormOnSubmit(): boolean {
    let isValid = true;
    isValid &&= this.validateUsername();
    isValid &&= this.validateEmail();
    isValid &&= this.validatePassword();
    isValid &&= this.validateConfirmPassword();
    isValid &&= this.validateUserRole();
    isValid &&= this.validateProjectCode();
    return isValid;
  }

  onRegister(): void {
    this.registrationMessage = null;
    this.isRegistering = false;

    if (!this.validateFormOnSubmit()) {
      this.registrationMessage = 'Please correct the errors above before registering.';
      return;
    }

    this.isRegistering = true;

    const registrationData = {
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password,
      confirmPassword: this.confirmPassword,
      role: [this.role],
      otp: (this.role === 'scrumMaster' || this.role === 'sdetEngineer') ? this.projectCode.trim() : ''
    };

    this.authService.register(registrationData).subscribe({
      next: (response) => {
        this.registrationMessage = response.message || 'Registration successful! You can now log in.';
        console.log('Registration Success:', response);
        alert(this.registrationMessage);
        this.resetForm();
        this.goToLogin.emit();
      },
      error: (err: Error) => {
        this.registrationMessage = err.message || 'Registration failed. An unexpected error occurred.';
        console.error('Registration Error:', err);
        alert(this.registrationMessage);
      }
    }).add(() => {
      this.isRegistering = false;
    });
  }

  private resetForm(): void {
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.role = 'productOwner';
    this.projectCode = '';
    this.clearErrors();
    this.registrationMessage = null;
  }

  onNavigateToLogin(event: Event): void {
    event.preventDefault();
    console.log('Navigating to Login page from Registration form.');
    this.router.navigate(['auth/login']);
  }
}
