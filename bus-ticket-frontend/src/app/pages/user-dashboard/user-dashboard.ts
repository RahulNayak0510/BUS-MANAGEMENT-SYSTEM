import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-user-dashboard',
  imports: [
    CommonModule
  ],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard implements OnInit {

  userName: string = '';
  userEmail: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userName = user.name || '';
        this.userEmail = user.email || '';
      } catch (e) {}
    }
  }

  searchBuses() {
    this.router.navigate(['/search-buses']);
  }

  myBookings() {
    this.router.navigate(['/my-bookings']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
