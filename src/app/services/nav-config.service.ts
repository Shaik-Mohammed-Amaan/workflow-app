import { Injectable } from '@angular/core';
import { NavConfig, NavItem } from '../interfaces/nav.interface';

@Injectable({
  providedIn: 'root'
})
export class NavConfigService {
  private readonly navConfig: NavConfig = {
    productOwner: [
      { label: 'Dashboard', route: '/dashboard/product-owner/home', icon: 'fas fa-home' },
      { label: 'Product Backlog', route: '/dashboard/product-owner/product-backlog', icon: 'fas fa-list' },
      { label: 'Scrum Teams', route: '/dashboard/product-owner/scrum-teams', icon: 'fas fa-users' }
    ],
    scrumMaster: [
      { label: 'Dashboard', route: '/dashboard/scrum-master/home', icon: 'fas fa-home' },
      { label: 'Product Backlog', route: '/dashboard/scrum-master/product-backlog', icon: 'fas fa-list' },
      { label: 'Sprint Backlog', route: '/dashboard/scrum-master/sprint-backlog', icon: 'fas fa-tasks' }
    ],
    sdetEngineer: [
      { label: 'Dashboard', route: '/dashboard/sdet/home', icon: 'fas fa-home' },
      { label: 'Test Cases', route: '/dashboard/sdet/test-cases', icon: 'fas fa-vial' },
      { label: 'Test Execution', route: '/dashboard/sdet/test-execution', icon: 'fas fa-play' }
    ]
  };

  getNavItems(role: string): NavItem[] {
    switch (role.toLowerCase()) {
      case 'productowner':
        return this.navConfig.productOwner;
      case 'scrummaster':
        return this.navConfig.scrumMaster;
      case 'sdetengineer':
        return this.navConfig.sdetEngineer;
      default:
        return [];
    }
  }
}