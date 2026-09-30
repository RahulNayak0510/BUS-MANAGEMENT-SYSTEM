import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService, BookingDetails } from '../../services/api';

@Component({
  selector: 'app-my-bookings',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings implements OnInit {

  bookings: BookingDetails[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  cancellingId: number | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.errorMessage = '';
    this.apiService.getMyBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load bookings:', err);
        this.errorMessage = err.error?.message || 'Failed to load your bookings.';
        this.loading = false;
      }
    });
  }

  cancelBooking(bookingId: number): void {
    if (!confirm('Are you sure you want to cancel this booking? Refund may apply based on policy.')) {
      return;
    }

    this.cancellingId = bookingId;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.cancelMyBooking(bookingId).subscribe({
      next: (updated) => {
        this.cancellingId = null;
        this.successMessage = 'Booking cancelled successfully!';
        this.loadBookings();
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.cancellingId = null;
        this.errorMessage = err.error?.message || 'Failed to cancel booking.';
      }
    });
  }

  canCancel(booking: BookingDetails): boolean {
    return booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'PENDING';
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return 'status-confirmed';
      case 'PENDING': return 'status-pending';
      case 'CANCELLED': return 'status-cancelled';
      case 'COMPLETED': return 'status-completed';
      default: return '';
    }
  }

  getPaymentClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED': return 'payment-success';
      case 'PENDING': return 'payment-pending';
      case 'FAILED': return 'payment-failed';
      default: return '';
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
