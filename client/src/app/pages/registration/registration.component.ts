import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  username: string = '';
  password: string = '';
  firstname: string = '';
  lastname: string = '';
  address: string = '';
  school: string = '';
  registrationError: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  }

  onSubmit() {
    this.authService.register(this.username, this.password, this.firstname, this.lastname, this.address, this.school).subscribe(
      (response) => {
        console.log('Registration successful');
        // Handle successful registration, e.g., redirect to login page
      },
      (error) => {
        console.error('Registration failed:', error);
        if (error.error && error.error.message) {
          this.registrationError = error.error.message;
        } else {
          this.registrationError = 'An unexpected error occurred';
        }
      },
      () => {
        console.log('Registration complete');
        // Additional completion handling, if needed
      }
    );
  }
}
