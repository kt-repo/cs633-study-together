import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/interfaces/User';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {Meetup} from "../interfaces/Meetup";
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private USER_KEY = 'currentUserId';
  private TOKEN_KEY = 'accessToken';

  constructor(private http: HttpClient) { }

  register(username: string, password: string, firstname: string, lastname: string, address: string, school: string): Observable<any> {
    const registerRequest = this.http.post<{ token: string, userId: string }>(`${this.apiUrl}/users/register`, { username, password, firstname, lastname, address, school });

    registerRequest.pipe(
      map(response => {
        // Assuming the response contains the user object upon successful registration
        this.setCurrentUserId(response.userId);
        this.saveToken(response.token);
        return response;
      }),
      catchError(this.handleError)
    );
    return registerRequest; // Return the observable
  }

  login(username: string, password: string): Observable<any> {
    const loginRequest = this.http.post<{ token: string, userId: string }>(`${this.apiUrl}/users/login`, { username, password });

    loginRequest.pipe(
      map(response => {
        // Assuming the response contains the user object upon successful login
        this.setCurrentUserId(response.userId);
        this.saveToken(response.token);
        console.log(`${response.userId} ${response.token}`);
        return response; // Return the response from the map operator
      }),
      catchError(this.handleError)
    );

    return loginRequest; // Return the observable
  }

  // login(username: string, password: string) {
  //   return this.http.post<{ token: string, userId: string }>(`${this.apiUrl}/users/login`, { username, password }).pipe(
  //     map(response => {
  //       // Assuming the response contains the user object upon successful login
  //       this.setCurrentUserId(response.userId);
  //       this.saveToken(response.token);
  //       console.log(`${response.userId} ${response.token}`)
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

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
