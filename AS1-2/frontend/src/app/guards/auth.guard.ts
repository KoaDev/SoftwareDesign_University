import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUser();
    const token = localStorage.getItem('token');

    if (user && token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      if (Date.now() < tokenData.exp * 1000) {
        return true;
      } else {
        localStorage.removeItem('token');
      }
    }

    this.router.navigate(['auth/login']);
    return false;
  }
}
