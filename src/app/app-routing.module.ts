import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { AuthGuard } from './auth/guards/auth.guard'; // Import the AuthGuard

// Import the new Dashboard Components
import { ProductOwnerDashboardComponent } from './components/dashboards/product-owner-dashboard/product-owner-dashboard.component';
import { ScrumMasterDashboardComponent } from './components/dashboards/scrum-master-dashboard/scrum-master-dashboard.component';
import { SdetEngineerDashboardComponent } from './components/dashboards/sdet-engineer-dashboard/sdet-engineer-dashboard.component';
import { AccessDeniedComponent } from './components/dashboards/access-denied/access-denied.component'; // Import AccessDeniedComponent
import { ProductBacklogComponent } from './components/product-backlog/product-backlog.component';
import { ScrumTeamsComponent } from './components/scrum-teams/scrum-teams.component'; // Import ScrumTeamsComponent
import { ScrumMasterProductBacklogComponent } from './components/scrum-master-product-backlog/scrum-master-product-backlog.component';
import { ScrumMasterSprintBacklogComponent } from './components/scrum-master-sprint-backlog/scrum-master-sprint-backlog.component';
// import { TestCasesComponent } from './components/test-cases/test-cases.component';
// import { TestExecutionComponent } from './components/test-execution/test-execution.component';
import { SdetEngineerSprintBacklogComponent } from './components/sdet-engineer-sprint-backlog/sdet-engineer-sprint-backlog.component'; // Import SdetEngineerSprintBacklogComponent
import { SdetEngineerTasksComponent } from './components/sdet-engineer-tasks/sdet-engineer-tasks.component';

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
        canActivate: [AuthGuard], // Specific guard for this route
        data: { roles: ['ROLE_PRODUCTOWNER'] }, // Define required roles
        children: [
          {
            path: '',
            component: ProductOwnerDashboardComponent
          },
          {
            path: 'product-backlog',
            component: ProductBacklogComponent,
            data: { roles: ['ROLE_PRODUCTOWNER'] }
          },
          {
            path: 'home',
            component: ProductOwnerDashboardComponent
          },
          {
            path: 'scrum-teams',
            component: ScrumTeamsComponent,
            canActivate: [AuthGuard],
            data: { roles: ['ROLE_PRODUCTOWNER'] }
          }
        ]
      },
      {
        path: 'scrum-master',
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_SCRUMMASTER'] },
        children: [
          {
            path: '',
            component: ScrumMasterDashboardComponent
          },
          {
            path: 'home',
            component: ScrumMasterDashboardComponent
          },
          {
            path: 'product-backlog',
            component: ScrumMasterProductBacklogComponent
          },
          {
            path: 'sprint-backlog',
            component: ScrumMasterSprintBacklogComponent
          }
        ]
      },
      {
        path: 'sdet-engineer',
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_SDETENGINEER'] },
        children: [
          { 
            path: '', 
            component: SdetEngineerDashboardComponent 
          },
          { 
            path: 'home', 
            component: SdetEngineerDashboardComponent 
          },
          {
            path: 'sprint-backlog',
            component: SdetEngineerSprintBacklogComponent
          },
          {
            path: 'tasks',
            component: SdetEngineerTasksComponent
          }
        ]
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