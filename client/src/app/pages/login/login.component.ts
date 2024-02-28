import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from "@angular/forms";
import { AuthService } from '../../services/auth.service';
import { CardComponent } from '../../ui/card/card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: [''],
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.loginForm.get('username')?.value || '');
    console.log(this.loginForm.get('password')?.value || '');
    this.authService.login(this.loginForm.get('username')?.value || '', this.loginForm.get('password')?.value || '').subscribe(
      response => {
        console.log(response);

        // Check if the response is undefined or null
        if (!response) {
          this.loginError = "Login Failed. Please try again.";
          return;
        }

        // Assuming the response contains an error field upon unsuccessful login
        if (response.error) {
          this.loginError = response.error.message || "An unexpected error occurred.";
          return;
        }

        // If there is no error in the response, consider it as a successful login
        this.authService.saveToken(response.token);
        this.authService.setCurrentUserId(response.userId);
        console.log('Login successful');
        // Redirect to another page or perform other actions as needed
        this.router.navigate(['/'])
          .then();
      },
      error => {
        console.error('Login failed:', error);
        // Handle login error, e.g., display error message
        if (error.error && error.error.message) {
          this.loginError = error.error.message;
        } else {
          this.loginError = 'An unexpected error occurred';
        }
      }
    );
  }
}
