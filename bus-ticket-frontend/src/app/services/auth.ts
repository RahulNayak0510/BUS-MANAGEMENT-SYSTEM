import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}

export interface RegistrationRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
}

export function clearAuthState(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      {
        email: email,
        password: password
      }
    );
  }

  register(data: RegistrationRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      data
    );
  }

  logout(): void {
    clearAuthState();
  }

  saveSession(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('role', response.role);
    localStorage.setItem('user', JSON.stringify({
      userId: response.userId,
      name: response.name,
      email: response.email,
      role: response.role
    }));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
