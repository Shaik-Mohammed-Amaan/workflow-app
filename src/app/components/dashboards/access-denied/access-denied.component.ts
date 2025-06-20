import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-access-denied',
  template: `
    <div class="access-denied-container">
      <h2>Access Denied</h2>
      <p>You do not have the necessary permissions to view this page.</p>
      <p>Please log in with an account that has the required roles, or contact support.</p>
      <button (click)="goToLogin()">Go to Login</button> </div>
  `,
  styleUrls: ['./access-denied.component.css'],
  standalone: false
})
export class AccessDeniedComponent {
  constructor(private router: Router) { } // Inject Router

  goToLogin(): void {
    this.router.navigate(['/auth/login']); // Programmatic navigation
  }
}