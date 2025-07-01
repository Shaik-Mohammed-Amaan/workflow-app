import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductOwnerDashboardComponent } from './components/dashboards/product-owner-dashboard/product-owner-dashboard.component';
import { ScrumMasterDashboardComponent } from './components/dashboards/scrum-master-dashboard/scrum-master-dashboard.component';
import { SdetEngineerDashboardComponent } from './components/dashboards/sdet-engineer-dashboard/sdet-engineer-dashboard.component';
import { AccessDeniedComponent } from './components/dashboards/access-denied/access-denied.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './auth/interceptors/jwt.interceptor';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProductBacklogComponent } from './components/product-backlog/product-backlog.component';
import { ScrumTeamsComponent } from './components/scrum-teams/scrum-teams.component';
import { CommonModule } from '@angular/common';
import { ScrumMasterProductBacklogComponent } from './components/scrum-master-product-backlog/scrum-master-product-backlog.component';
import { ScrumMasterSprintBacklogComponent } from './components/scrum-master-sprint-backlog/scrum-master-sprint-backlog.component';
import { SdetEngineerSprintBacklogComponent } from './components/sdet-engineer-sprint-backlog/sdet-engineer-sprint-backlog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SdetEngineerTasksComponent } from './components/sdet-engineer-tasks/sdet-engineer-tasks.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductOwnerDashboardComponent,
    ScrumMasterDashboardComponent,
    SdetEngineerDashboardComponent,
    AccessDeniedComponent,
    NavbarComponent,
    SidebarComponent,
    ProductBacklogComponent,
    ScrumTeamsComponent,
    ScrumMasterProductBacklogComponent,
    ScrumMasterDashboardComponent,
    ScrumMasterSprintBacklogComponent,
    SdetEngineerSprintBacklogComponent,
    SdetEngineerTasksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    DragDropModule, // Import DragDropModule for drag-and-drop functionality
    
  ],
  providers: [
    // Provide the JwtInterceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true // multi: true means this is one of potentially many interceptors
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }