import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../ui/card/card.component';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MeetupService } from 'src/app/services/meetup.service';
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

  constructor(private formBuilder: FormBuilder, private meetupService: MeetupService, private router: Router) {
    this.meetupForm = this.formBuilder.group({
      title: [''],
      description: [''],
      address: [''],
      image: ['']
    });
  }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    const file: File | null = event.target.files?.[0] || null; // Use optional chaining to avoid null access
    if (file) {
      this.meetupForm.get('image')?.setValue(file); // Use optional chaining to avoid null access
    }
  }

  submitHandler() {
    const meetup: Meetup = {
      id: '', // Generate an ID or handle on server-side
      title: this.meetupForm.get('title')?.value || '',
      description: this.meetupForm.get('description')?.value || '',
      address: this.meetupForm.get('address')?.value || '',
      image: this.meetupForm.get('image')?.value || null // Initialize with null if not set
    };


    this.meetupService.postMeetup(meetup).subscribe(
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
