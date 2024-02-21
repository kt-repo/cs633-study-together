import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Meetup } from '../interfaces/Meetup';
import {map, Observable, of, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";
// import { environment } from '../environments/environment';
import { environment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private apiUrl = '/api';
  // private apiUrl = environment.apiUrl;
  http = inject(HttpClient);
  favorites = signal<Meetup[]>([]);

  get totalFavorites() {
    return this.favorites().length;
  }

  isMeetupFavorite(meetup: Meetup) {
    return this.favorites().some((favorite) => favorite._id === meetup._id);
  }

  addToFavorites(meetup: Meetup) {
    this.favorites.mutate((oldFavorites) => oldFavorites.push(meetup));
  }

  removeFromFavorites(meetup: Meetup) {
    this.favorites.update((oldFavorites) =>
      oldFavorites.filter((favorite) => favorite._id !== meetup._id)
    );
  }

  getMeetups() {
    console.log('Making GET request to:', `${this.apiUrl}/meetup`);
    const request = this.http.get<Meetup[]>(`${this.apiUrl}/meetup`);
    request.subscribe(response => console.log('Response received:', response)); // Log the response when it arrives
    return request;
  }

  getMeetupId(meetup: Meetup) {
    const meetupId = meetup._id;
    return this.http.get<Meetup>(`${this.apiUrl}/meetup/${meetupId}`);
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

  deleteMeetup(meetup: Meetup, token: string | null): Observable<any> {
    const meetupId = meetup._id;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log('heyyyyyyyy');
    console.log(token);
    console.log(meetup);
    return this.http.delete<any>(`${this.apiUrl}/meetup/${meetupId}`, { headers }).pipe(
      map(response => {
        console.log(response);
      }),
      catchError(error => {
        let errorMessage = 'An error occurred deleting meetup';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return throwError(errorMessage);
      })
    );
  }

}
