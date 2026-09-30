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

    console.log('Sending login request...');
    console.log('Email:', this.email);

    this.authService.login(this.email, this.password).subscribe({

      next: (response) => {

        console.log('LOGIN SUCCESS:', response);

        this.loading = false;

        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('user', JSON.stringify(response));

        console.log('Token saved');
        console.log('Role:', response.role);

        if (response.role === 'ADMIN') {

          console.log('Redirecting to admin dashboard');

          this.router.navigate(['/admin-dashboard']);

        } else {

          console.log('Redirecting to user dashboard');

          this.router.navigate(['/user-dashboard']);
        }
      },

      error: (error) => {

        console.error('LOGIN ERROR:', error);

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