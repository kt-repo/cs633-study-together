import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Meetup } from '../interfaces/Meetup';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private apiUrl = 'http://localhost:3001';
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
    return this.http.get<Meetup[]>(`${this.apiUrl}/meetup`).pipe(
      map((data) => {
        const meetups = [];
        for (const key in data) {
          const meetup = { ...data[key], id: key };
          meetups.push(meetup);
        }
        return meetups;
      })
    );
  }

  postMeetup(meetup: Meetup): Observable<any> {

    const formData = new FormData();
    formData.append('title', meetup.title);
    formData.append('description', meetup.description);
    formData.append('address', meetup.address);
    formData.append('image', meetup.image);

    console.log(meetup);
    console.log(formData);

    return this.http.post<any>(`${this.apiUrl}/meetup`, meetup);
  }
}
