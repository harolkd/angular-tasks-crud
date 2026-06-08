import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private api = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.api}/login`, data).pipe(
      tap(res => this.saveToken(res.token))  // ← guarda el token automáticamente
    );
  }

  register(data: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.api}/register`, data).pipe(
      tap(res => this.saveToken(res.token))  // ← igual aquí
    );
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
