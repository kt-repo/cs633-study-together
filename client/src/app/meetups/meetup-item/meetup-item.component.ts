import { Component, Input, OnInit, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../ui/card/card.component';
import { Meetup } from 'src/app/interfaces/Meetup';
import { MeetupService } from 'src/app/services/meetup.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-meetup-item',
  standalone: true,
  templateUrl: './meetup-item.component.html',
  styleUrls: ['./meetup-item.component.scss'],
  imports: [CommonModule, CardComponent],
})
export class MeetupItemComponent implements OnInit {
  @Input() meetup!: Meetup;
  @Output() meetupDeleted: EventEmitter<string> = new EventEmitter<string>();

  // ownerName: string | null = null;
  meetupService = inject(MeetupService);
  authService = inject(AuthService);
  isMeetupFavorite = signal(false);

  ngOnInit(): void {
    this.isMeetupFavorite.set(this.meetupService.isMeetupFavorite(this.meetup));
    // this.setOwnerName();
  }

  toggleFavorite(meetup: Meetup) {
    if (this.isMeetupFavorite()) {
      this.meetupService.removeFromFavorites(meetup);
      this.isMeetupFavorite.set(false);
    } else {
      this.meetupService.addToFavorites(meetup);
      this.isMeetupFavorite.set(true);
    }
  }

  onDeleteMeetup(meetup: Meetup): void {
    if (!meetup._id) {
      console.error('Meetup ID is missing or undefined');
      return;
    }

    const token = this.authService.getToken();
    this.meetupService.deleteMeetup(meetup, token).subscribe(
      () => {
        console.log('Meetup deleted successfully');
        // Handle deletion success if needed
        this.meetupDeleted.emit(meetup._id); // Emit event when meetup is deleted
      },
      (error) => {
        console.error('Error deleting meetup:', error);
        // Handle deletion error if needed
      }
    );
  }

  // setOwnerName(): void {
  //   if (this.meetup.id) {
  //     this.authService.getUserById(this.meetup.owner).subscribe(
  //       (user) => {
  //         this.ownerName = `${user.firstname} ${user.lastname}`; // Assuming the name property is available in your object
  //       },
  //       (error) => {
  //         console.error('Error fetching object details:', error);
  //         // Handle error
  //       }
  //     );
  //   }
  // }
}
