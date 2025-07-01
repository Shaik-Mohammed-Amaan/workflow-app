import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { NavConfigService } from '../../services/nav-config.service';
import { NavItem } from '../../interfaces/nav.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent implements OnInit {
  dropdownVisible: boolean = false;
  profileModalVisible: boolean = false;
  user: any = null;
  navItems: NavItem[] = [];
  username: string = '';
  userRole: string = '';
  isUserMenuOpen: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private navConfigService: NavConfigService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((currentUser) => {
      if (currentUser) {
        this.username = currentUser.username;
        this.userRole = currentUser.roles[0];
        this.navItems = this.navConfigService.getNavItems(this.userRole);
      }
    });
  }

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  openProfile(): void {
    this.profileModalVisible = true;
  }

  closeProfile(): void {
    this.profileModalVisible = false;
  }

  resetPassword(): void {
    alert('Password reset functionality triggered.');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && !target.closest('.user-icon')) {
      this.dropdownVisible = false;
    }
  }
}