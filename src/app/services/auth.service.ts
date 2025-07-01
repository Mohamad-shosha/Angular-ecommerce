// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm, LoginForm } from '../components/auth/auth.model';
import { Observable } from 'rxjs';

export interface JwtAuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  /**
   * Register a new user
   */
  register(data: RegisterForm): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  /**
   * Login a user and return access & refresh tokens
   */
  login(data: LoginForm): Observable<JwtAuthResponse> {
    // تنظيف البيانات القديمة زي React
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');

    return this.http.post<JwtAuthResponse>(`${this.baseUrl}/login`, data);
  }

  /**
   * Refresh the access token
   */
  refreshToken(refreshToken: string): Observable<JwtAuthResponse> {
    return this.http.post<JwtAuthResponse>(`${this.baseUrl}/refresh`, {
      refreshToken,
    });
  }
}
