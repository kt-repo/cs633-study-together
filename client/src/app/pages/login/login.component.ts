import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log('Login successful');
        // Handle successful login, e.g., redirect to another page
      },
      error => {
        console.error('Login failed:', error);
        // Handle login error, e.g., display error message
      }
    );
  }
}
