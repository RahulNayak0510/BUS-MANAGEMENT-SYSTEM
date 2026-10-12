import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  address: string = '';
  gender: 'MALE' | 'FEMALE' | 'OTHER' = 'MALE';
  dateOfBirth: string = '';

  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name || !this.email || !this.phone || !this.password || !this.dateOfBirth) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.loading = true;

    this.authService.register({
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      address: this.address,
      gender: this.gender,
      dateOfBirth: this.dateOfBirth
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.authService.saveSession(response);

        this.successMessage = 'Registration successful! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/user-dashboard']);
        }, 1000);
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Make sure Spring Boot is running on port 8080.';
        } else {
          this.errorMessage = error.error?.message || error.message || 'Registration failed. Please try again.';
        }
      }
    });
  }
}
