import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

interface MenuItem {
  title: string;
  route: string;
  icon: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone:false
})
export class SidebarComponent implements OnInit {
hasRole(arg0: string[]): any {
throw new Error('Method not implemented.');
}
  isSidebarOpen = false;
  menuItems: MenuItem[] = [];
  userRole: string = '';

  constructor(private router: Router, private authService: AuthService) {
    // Set initial sidebar state based on screen size
    this.isSidebarOpen = window.innerWidth >= 1024;
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((currentUser) => {
      if (currentUser && currentUser.roles) {
        this.userRole = currentUser.roles[0];
        this.setMenuItems();
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    // Automatically open sidebar on large screens
    if (window.innerWidth >= 1024) {
      this.isSidebarOpen = true;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      this.isSidebarOpen = false;
    }
  }

  private setMenuItems(): void {
    switch (this.userRole.toLowerCase()) {
      case 'role_productowner':
        this.menuItems = [
          { 
            title: 'Dashboard', 
            icon: 'fas fa-tachometer-alt',
            route: '/dashboard/product-owner/home',
            roles: ['ROLE_PRODUCTOWNER']
          },
          { 
            title: 'Product Backlog', 
            icon: 'fas fa-list-alt',
            route: '/dashboard/product-owner/product-backlog',
            roles: ['ROLE_PRODUCTOWNER']
          },
          { 
            title: 'Scrum Teams', 
            icon: 'fas fa-users',
            route: '/dashboard/product-owner/scrum-teams',
            roles: ['ROLE_PRODUCTOWNER']
          }
        ];
        break;

      case 'role_scrummaster':
        this.menuItems = [
          { 
            title: 'Dashboard', 
            icon: 'fas fa-tachometer-alt',
            route: '/dashboard/scrum-master/home',
            roles: ['ROLE_SCRUMMASTER']
          },
          { 
            title: 'Product Backlog', 
            icon: 'fas fa-list-alt',
            route: '/dashboard/scrum-master/product-backlog',
            roles: ['ROLE_SCRUMMASTER']
          },
          { 
            title: 'Sprint Backlog', 
            icon: 'fas fa-tasks',
            route: '/dashboard/scrum-master/sprint-backlog',
            roles: ['ROLE_SCRUMMASTER']
          }
        ];
        break;

      case 'role_sdetengineer':
        this.menuItems = [
          { 
            title: 'Dashboard', 
            icon: 'fas fa-tachometer-alt',
            route: '/dashboard/sdet/home',
            roles: ['ROLE_SDETENGINEER']
          },
          
          {
            title: 'Sprint Backlog',
            route: '/dashboard/sdet-engineer/sprint-backlog',
            icon: 'fas fa-tasks',
            roles: ['ROLE_SDETENGINEER']
          },
          {
            title: 'Tasks',
            route: '/dashboard/sdet-engineer/tasks',
            icon: 'fas fa-clipboard-list',
            roles: ['ROLE_SDETENGINEER']
          }
        ];
        break;
    }
  }
}
