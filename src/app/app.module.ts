// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http'; // CRITICAL: Import HttpClientModule

// import { AppComponent } from './app.component';
// import { LoginComponent } from './auth/components/login/login.component';
// import { RegistrationComponent } from './auth/components/registration/registration.component';
// import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
// import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';

// @NgModule({
//   declarations: [
//     AppComponent,
//     LoginComponent,
//     RegistrationComponent,
//     ForgotPasswordComponent,
//     ResetPasswordComponent
//   ],
//   imports: [
//     BrowserModule,
//     FormsModule,
//     HttpClientModule // Add HttpClientModule to imports
//   ],
//   providers: [], // AuthService is providedIn: 'root', so no need to list here
//   bootstrap: [AppComponent]
// })
// export class AppModule { }


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


@NgModule({
  declarations: [
    AppComponent,
    ProductOwnerDashboardComponent,
    ScrumMasterDashboardComponent,
    SdetEngineerDashboardComponent,
    AccessDeniedComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
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