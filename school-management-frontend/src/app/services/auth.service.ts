import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface LoginResponse { token: string; }
export interface JwtPayload { sub?: string; exp?: number; roles?: string[]; }

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = 'http://localhost:8080/api/admin';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      catchError((err: HttpErrorResponse) => {
        // Nettoyage sur 401/403, évite d'avoir un token invalide conservé
        if (err.status === 401 || err.status === 403) {
          this.logout();
        }
        return throwError(() => err);
      })
    );
  }

  saveToken(token: string): void {
    console.log('saveToken called with:', token);
    if (!this.isValidJwtFormat(token)) {
      console.error('Invalid JWT format, not saving');
      return;
    }
    try {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', token);
        console.log('Token saved to localStorage');
      } else {
        console.warn('Not on browser, skipping localStorage');
      }
    } catch (e) {
      console.error('localStorage not available', e);
    }
  }

  getToken(): string | null {
    console.log('getToken called');
    try {
      if (isPlatformBrowser(this.platformId)) {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);
        return token && this.isValidJwtFormat(token) ? token : null;
      } else {
        console.warn('Not on browser, skipping localStorage');
        return null;
      }
    } catch (e) {
      console.error('localStorage not available', e);
      return null;
    }
  }

  logout(): void {
    try {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('token');
      }
    } catch (e) {
      console.error('localStorage not available', e);
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    console.log('isAuthenticated token:', token);
    if (!token) {
      console.log('isAuthenticated: no token');
      return false;
    }
    const expired = this.isTokenExpired(token);
    console.log('isAuthenticated: expired?', expired);
    return !expired;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodePayload(token);
      console.log('isTokenExpired payload:', payload);
      if (!payload?.exp) return false; // si pas d'exp, on considère non expiré
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  private decodePayload(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      return JSON.parse(atob(parts[1]));
    } catch {
      return null;
    }
  }

  private isValidJwtFormat(token: string): boolean {
    // Simple validation structure JWT (3 parties séparées par des points)
    return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(token);
  }
}