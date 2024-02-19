import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/interfaces/User';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private USER_KEY = 'currentUserId';
  private TOKEN_KEY = 'accessToken';

  constructor(private http: HttpClient) { }

  register(username: string, password: string) {
    return this.http.post<{ token: string, userId: string }>(`${this.apiUrl}/users/register`, { username, password }).pipe(
      map(response => {
        // Assuming the response contains the user object upon successful registration
        this.setCurrentUserId(response.userId);
        this.saveToken(response.token);
      }),
      catchError(this.handleError)
    );
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string, userId: string }>(`${this.apiUrl}/users/login`, { username, password }).pipe(
      map(response => {
        // Assuming the response contains the user object upon successful login
        this.setCurrentUserId(response.userId);
        this.saveToken(response.token);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    return of(null); // You can handle errors as needed
  }

  // token
  saveToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
  }

  // user
  setCurrentUserId(userId: string): void {
    // Store the user object in localStorage
    localStorage.setItem('currentUserId', userId);
  }

  getCurrentUserId(): string | null {
    // Retrieve the user object from localStorage
    return localStorage.getItem('currentUserId');
  }

  clearCurrentUser(): void {
    // Clear the user object from localStorage
    localStorage.removeItem('currentUserId');
  }
}
