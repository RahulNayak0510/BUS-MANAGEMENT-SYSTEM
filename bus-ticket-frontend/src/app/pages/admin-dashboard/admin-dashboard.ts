import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  totalBuses: number = 0;
  totalJourneys: number = 0;
  totalBookings: number = 0;
  totalOperators: number = 0;
  totalLocations: number = 0;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.apiService.getBusesV2().subscribe({
      next: (buses) => { this.totalBuses = buses.length; },
      error: () => {}
    });

    this.apiService.getJourneys().subscribe({
      next: (j) => { this.totalJourneys = j.length; },
      error: () => {}
    });

    this.apiService.getAllBookingsAdmin().subscribe({
      next: (b) => { this.totalBookings = b.length; },
      error: () => {}
    });

    this.apiService.getOperators().subscribe({
      next: (o) => { this.totalOperators = o.length; },
      error: () => {}
    });

    this.apiService.getLocations().subscribe({
      next: (l) => { this.totalLocations = l.length; },
      error: () => {}
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  addBus() {
    this.router.navigate(['/admin/buses/add']);
  }

  manageBuses() {
    this.router.navigate(['/admin/buses']);
  }

  manageJourneys() {
    this.router.navigate(['/admin/journeys']);
  }

  viewBookings() {
    this.router.navigate(['/admin/bookings']);
  }

  manageOperators() {
    this.router.navigate(['/admin/operators']);
  }

  manageLocations() {
    this.router.navigate(['/admin/locations']);
  }

  manageSeatsQuick() {
    this.router.navigate(['/admin/buses']);
  }
}
