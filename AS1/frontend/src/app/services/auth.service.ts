import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/api/login`, { email, password });
  }

  getUser() {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.user;
    }

    return null;
  }
}
