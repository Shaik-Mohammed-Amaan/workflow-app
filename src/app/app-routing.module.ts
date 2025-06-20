import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { AuthGuard } from './auth/guards/auth.guard'; // Import the AuthGuard

// Import the new Dashboard Components
import { ProductOwnerDashboardComponent } from './components/dashboards/product-owner-dashboard/product-owner-dashboard.component';
import { ScrumMasterDashboardComponent } from './components/dashboards/scrum-master-dashboard/scrum-master-dashboard.component';
import { SdetEngineerDashboardComponent } from './components/dashboards/sdet-engineer-dashboard/sdet-engineer-dashboard.component';
import { AccessDeniedComponent } from './components/dashboards/access-denied/access-denied.component'; // Import AccessDeniedComponent

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    redirectTo: 'auth', // Redirect base URL to the auth section
    pathMatch: 'full'
  },
  // Add dashboard routes with AuthGuard and roles data
  {
    path: 'dashboard',
    canActivate: [AuthGuard], // This guard ensures only logged-in users can access any dashboard sub-route
    children: [
      {
        path: 'product-owner',
        component: ProductOwnerDashboardComponent,
        canActivate: [AuthGuard], // Specific guard for this route
        data: { roles: ['ROLE_PRODUCTOWNER'] } // Define required roles
      },
      {
        path: 'scrum-master',
        component: ScrumMasterDashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_SCRUMMASTER'] }
      },
      {
        path: 'sdet-engineer',
        component: SdetEngineerDashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_SDETENGINEER'] }
      },
      
      {
        path: '', // Redirect /dashboard to /dashboard/default
        redirectTo: 'default',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'access-denied', // Route for forbidden access
    component: AccessDeniedComponent
  },
  {
    path: 'reset-password', // Keep this top-level for correct query param handling
    component: ResetPasswordComponent
  },
  {
    path: '**', // Wildcard route for any unmatched route
    redirectTo: 'auth' // Redirects to auth (login page)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }