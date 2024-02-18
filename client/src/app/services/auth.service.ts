import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  register(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/users/register`, { username, password });
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/users/login`, { username, password });
  }
}
