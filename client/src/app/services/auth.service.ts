import {Injectable, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/interfaces/User';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private USER_KEY = 'currentUserId';
  private TOKEN_KEY = 'accessToken';
  isLoggedIn = signal<boolean>(false);

  constructor(private http: HttpClient) {
    localStorage.setItem('accessToken', '');
    localStorage.setItem('currentUserId', '');
  }

  get isUserLoggedIn() {
    return this.isLoggedIn();
  }

  updateLoginStatus(status: boolean) {
    this.isLoggedIn.update(() => status);
  }

  register(username: string, password: string, firstname: string, lastname: string, address: string, school: string): Observable<any> {
    const registerRequest = this.http.post<{ token: string, userId: string }>(`${this.apiUrl}/users/register`, { username, password, firstname, lastname, address, school });
    return registerRequest; // Return the observable
  }

  login(username: string, password: string): Observable<any> {
    const loginRequest = this.http.post<{ token: string, userId: string }>(`${this.apiUrl}/users/login`, { username, password });
    return loginRequest; // Return the observable
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    return of(null); // You can handle errors as needed
  }

  getUserById(userId: string) {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }

  // token
  saveToken(token: string): void {
    localStorage.setItem('accessToken', token);
    console.log(`saving token: ${token}`)
  }

  getToken(): string | null {
    console.log(`getting token: ${localStorage.getItem('accessToken')}`)
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
