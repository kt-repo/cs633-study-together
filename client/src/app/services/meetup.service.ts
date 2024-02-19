import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Meetup } from '../interfaces/Meetup';
import {map, Observable, of, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private apiUrl = 'http://localhost:3000';
  http = inject(HttpClient);
  favorites = signal<Meetup[]>([]);

  get totalFavorites() {
    return this.favorites().length;
  }

  isMeetupFavorite(meetup: Meetup) {
    return this.favorites().some((favorite) => favorite.id === meetup.id);
  }

  addToFavorites(meetup: Meetup) {
    this.favorites.mutate((oldFavorites) => oldFavorites.push(meetup));
  }

  removeFromFavorites(meetup: Meetup) {
    this.favorites.update((oldFavorites) =>
      oldFavorites.filter((favorite) => favorite.id !== meetup.id)
    );
  }

  getMeetups() {
    return this.http.get<Meetup[]>(`${this.apiUrl}/meetup`);
  }

  postMeetup(meetup: Meetup, token: String | null): Observable<any> {

    const formData = new FormData();
    formData.append('title', meetup.title);
    formData.append('description', meetup.description);
    formData.append('address', meetup.address);
    formData.append('owner', meetup.owner);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/meetup`, meetup, {  headers }).pipe(
      map(response => {
        console.log(meetup);
      }),
      catchError(error => {
        let errorMessage = 'An error occurred during login';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return throwError(errorMessage);
      })
    );
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    return of(null);
  }
}
