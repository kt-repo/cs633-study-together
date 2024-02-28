import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../ui/card/card.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MeetupService } from 'src/app/services/meetup.service';
import { AuthService } from 'src/app/services/auth.service';
import { Meetup } from 'src/app/interfaces/Meetup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-meetup-form',
  standalone: true,
  templateUrl: './new-meetup-form.component.html',
  styleUrls: ['./new-meetup-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, CardComponent],
})
export class NewMeetupFormComponent implements OnInit {
  meetupForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private meetupService: MeetupService, private authService: AuthService, private router: Router) {
    this.meetupForm = this.formBuilder.group({
      title: [''],
      description: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
  }

  submitHandler() {
    console.log('retrieving token')
    const token = this.authService.getToken();
    if (!token) {
      console.error('User token is not available');
      // Handle error, redirect to login page, etc.
      return;
    } else {
      console.log('got token in new meetup submit handler')
    }

    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) {
      console.error('User is not logged in');
      // Handle error, redirect to login page, etc.
      return;
    } else {
      console.log(currentUserId);
      console.log(token);
    }

    const meetup: Meetup = {
      _id: '', // Generate an ID or handle on server-side
      title: this.meetupForm.get('title')?.value || '',
      description: this.meetupForm.get('description')?.value || '',
      address: this.meetupForm.get('address')?.value || '',
      owner: currentUserId || ''
    };

    this.meetupService.postMeetup(meetup, token).subscribe(
      response => {
        console.log('Meetup created successfully:', response);
        this.router.navigate(['/']);
        // Handle success response
      },
      error => {
        console.error('Error creating meetup:', error);
        // Handle error response
      }
    );
  }
}
