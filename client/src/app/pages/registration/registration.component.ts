import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CardComponent } from '../../ui/card/card.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  registrationError: string | null = null;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.registrationForm = this.formBuilder.group({
      username: [''],
      password: [''],
      firstname: [''],
      lastname: [''],
      address: [''],
      school: [''],
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.authService.register(
      this.registrationForm.get('username')?.value || '',
      this.registrationForm.get('password')?.value || '',
      this.registrationForm.get('firstname')?.value || '',
      this.registrationForm.get('lastname')?.value || '',
      this.registrationForm.get('address')?.value || '',
      this.registrationForm.get('school')?.value || '',
      ).subscribe(
      (response) => {
        console.log(response);

        // Check if the response is undefined or null
        if (!response) {
          this.registrationError = "Registration Failed. Please try again.";
          return;
        }

        // Assuming the response contains an error field upon unsuccessful login
        if (response.error) {
          this.registrationError = response.error.message || "An unexpected error occurred.";
          return;
        }

        console.log('Registration successful');
        this.authService.saveToken(response.token);
        this.authService.setCurrentUserId(response.userId);
        // Handle successful registration, e.g., redirect to login page
        this.router.navigate(['/']);
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
