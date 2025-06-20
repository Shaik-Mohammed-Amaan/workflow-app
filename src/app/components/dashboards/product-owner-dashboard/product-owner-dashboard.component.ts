import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
@Component({
  selector: 'app-product-owner-dashboard',
  standalone: false,
  templateUrl: './product-owner-dashboard.component.html',
  styleUrl: './product-owner-dashboard.component.css'
})
export class ProductOwnerDashboardComponent implements OnInit {
  username: string = '';
  roles: string[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.username = user.username;
      this.roles = user.roles;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}

