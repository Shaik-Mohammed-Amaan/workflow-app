import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
@Component({
  selector: 'app-sdet-engineer-dashboard',
  standalone: false,
  templateUrl: './sdet-engineer-dashboard.component.html',
  styleUrl: './sdet-engineer-dashboard.component.css'
})
export class SdetEngineerDashboardComponent implements OnInit {
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