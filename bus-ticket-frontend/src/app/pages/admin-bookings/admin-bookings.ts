import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService, BookingDetails } from '../../services/api';
import { clearAuthState } from '../../services/auth';

@Component({
  selector: 'app-admin-bookings',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './admin-bookings.html',
  styleUrl: './admin-bookings.css'
})
export class AdminBookings implements OnInit {

  bookings: BookingDetails[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  filterStatus: string = 'ALL';
  searchText: string = '';

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
    this.apiService.getAllBookingsAdmin().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load bookings:', err);
        this.errorMessage = err.error?.message || 'Failed to load bookings.';
        this.loading = false;
      }
    });
  }

  get filteredBookings(): BookingDetails[] {
    return this.bookings.filter(b => {
      const statusMatch = this.filterStatus === 'ALL' || b.bookingStatus.toUpperCase() === this.filterStatus;
      const searchMatch = !this.searchText ||
        b.userName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        b.busNumber.toLowerCase().includes(this.searchText.toLowerCase()) ||
        b.sourceCity.toLowerCase().includes(this.searchText.toLowerCase()) ||
        b.destinationCity.toLowerCase().includes(this.searchText.toLowerCase()) ||
        String(b.bookingId).includes(this.searchText);
      return statusMatch && searchMatch;
    });
  }

  cancelBooking(id: number): void {
    if (!confirm('Cancel this booking as admin? This action cannot be undone.')) return;

    this.cancellingId = id;
    this.errorMessage = '';

    this.apiService.cancelBookingAdmin(id).subscribe({
      next: () => {
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
    return booking.bookingStatus !== 'CANCELLED';
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
      default: return 'payment-default';
    }
  }

  get totalRevenue(): number {
    return this.filteredBookings
      .filter(b => b.bookingStatus !== 'CANCELLED')
      .reduce((sum, b) => sum + b.totalAmount, 0);
  }

  logout(): void {
    clearAuthState();
    this.router.navigate(['/login']);
  }
}
