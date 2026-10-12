import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, BookingDetails, PaymentResponse, PaymentRequest, SeatAvailability } from '../../services/api';
import { clearAuthState } from '../../services/auth';

@Component({
  selector: 'app-booking',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class Booking implements OnInit {

  journeyId: number | null = null;
  seatId: number | null = null;

  seatInfo: SeatAvailability | null = null;
  bookingDetails: BookingDetails | null = null;
  paymentResult: PaymentResponse | null = null;

  loading: boolean = false;
  processingPayment: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  bookingCreated: boolean = false;
  paymentCompleted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.journeyId = params['journeyId'] ? +params['journeyId'] : null;
      this.seatId = params['seatId'] ? +params['seatId'] : null;

      if (!this.journeyId || !this.seatId) {
        this.errorMessage = 'Invalid booking parameters. Please go back and try again.';
      }
    });
  }

  confirmAndPay(): void {
    if (!this.journeyId || !this.seatId) return;

    this.loading = true;
    this.errorMessage = '';

    this.apiService.createBooking(this.journeyId, this.seatId).subscribe({
      next: (details) => {
        this.bookingDetails = details;
        this.bookingCreated = true;
        this.loading = false;
        this.makePayment(details.bookingId);
      },
      error: (err) => {
        console.error('Booking creation error:', err);
        this.errorMessage = err.error?.message || 'Failed to create booking. Please try again.';
        this.loading = false;
      }
    });
  }

  makePayment(bookingId: number): void {
    this.processingPayment = true;

    const paymentReq: PaymentRequest = {
      bookingId: bookingId,
      paymentMethod: 'UPI'
    };

    this.apiService.makePayment(paymentReq).subscribe({
      next: (payment) => {
        this.paymentResult = payment;
        this.paymentCompleted = true;
        this.processingPayment = false;
        this.successMessage = 'Booking confirmed! Payment successful.';
      },
      error: (err) => {
        console.error('Payment error:', err);
        this.errorMessage = err.error?.message || 'Payment failed. Please try again.';
        this.processingPayment = false;
      }
    });
  }

  goToMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  logout(): void {
    clearAuthState();
    this.router.navigate(['/login']);
  }
}
