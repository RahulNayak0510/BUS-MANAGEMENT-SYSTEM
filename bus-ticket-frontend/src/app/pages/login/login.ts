import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email: string = '';
  password: string = '';

  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({

      next: (response) => {
        this.loading = false;
        this.authService.saveSession(response);

        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);

        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },

      error: (error) => {

        this.loading = false;

        if (error.status === 0) {

          this.errorMessage =
            'Cannot connect to server. Make sure Spring Boot is running on port 8080.';

        } else if (error.status === 401) {

          this.errorMessage =
            'Invalid email or password.';

        } else if (error.status === 400) {

          this.errorMessage =
            error.error?.message ||
            'Invalid login details.';

        } else {

          this.errorMessage =
            error.error?.message ||
            error.message ||
            'Login failed. Please try again.';
        }
      }

    });
  }
}
