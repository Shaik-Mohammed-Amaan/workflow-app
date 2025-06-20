// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Adjust path

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user = this.authService.currentUserValue; // Get current user info

    if (user && this.authService.isLoggedIn()) { // Check if user is logged in
      // Get roles required by the route from route.data
      const requiredRoles = route.data['roles'] as string[];

      if (requiredRoles && requiredRoles.length) { // If roles are specified for the route
        const hasRequiredRole = this.authService.hasRole(requiredRoles); // Check if user has any of the required roles

        if (hasRequiredRole) {
          return true; // User has required role, allow access
        } else {
          // User is logged in but doesn't have the required role
          console.warn('Unauthorized access: User does not have required roles.', requiredRoles, user.roles);
          // Redirect to an 'access denied' page
          this.router.navigate(['/access-denied']);
          return false;
        }
      }
      // No specific roles required for this route, just needs to be logged in
      return true;
    }

    // Not logged in, redirect to login page
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}