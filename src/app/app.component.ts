import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf
import { LoginComponent } from './auth/components/login/login.component';
import { RegistrationComponent } from './auth/components/registration/registration.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  showPage: 'login' | 'registration' = 'login';
  
  constructor() { }
}
