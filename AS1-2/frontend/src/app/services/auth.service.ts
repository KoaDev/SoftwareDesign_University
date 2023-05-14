import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }


  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log(token);
    return new HttpHeaders({
      'Authorization': `${token}`,
    });
  }

  getUserScoreById(id: string): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}/api/users/${id}/score`, { headers });
  }
  
  updateUserScoreById(score : string, id : string) {
    const headers = this.getAuthHeaders();
    return this.http.put<{ token: string }>(`${this.apiUrl}/api/users/${id}/score`, {score, headers});
  }

  register(name: string, email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/api/users`, { name, email, password });
  }
  
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

  isLoggedIn() {
    const token = localStorage.getItem('token');

    if (token) {
      return !this.jwtHelper.isTokenExpired(token);
    }

    return false;
  }

  isModerator() {
    const user = this.getUser();
    return user && user.role === 'moderator';
  }

  
}
