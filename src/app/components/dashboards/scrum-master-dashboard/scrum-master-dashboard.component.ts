import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
@Component({
  selector: 'app-scrum-master-dashboard',
  standalone: false,
  templateUrl: './scrum-master-dashboard.component.html',
  styleUrl: './scrum-master-dashboard.component.css'
})
export class ScrumMasterDashboardComponent implements OnInit {
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
