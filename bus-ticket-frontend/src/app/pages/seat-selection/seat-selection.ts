import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, SeatAvailability, JourneySearchResult } from '../../services/api';
import { clearAuthState } from '../../services/auth';

@Component({
  selector: 'app-seat-selection',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './seat-selection.html',
  styleUrl: './seat-selection.css'
})
export class SeatSelection implements OnInit {

  journeyId: number | null = null;
  seats: SeatAvailability[] = [];
  journey: JourneySearchResult | null = null;
  selectedSeats: SeatAvailability[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.journeyId = params['journeyId'] ? +params['journeyId'] : null;
      if (this.journeyId) {
        this.loadSeats();
      } else {
        this.errorMessage = 'No journey selected. Please go back and search again.';
      }
    });
  }

  loadSeats(): void {
    if (!this.journeyId) return;
    this.loading = true;
    this.apiService.getSeatAvailability(this.journeyId).subscribe({
      next: (seats) => {
        this.seats = seats;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load seats:', err);
        this.errorMessage = 'Failed to load seat availability.';
        this.loading = false;
      }
    });
  }

  toggleSeat(seat: SeatAvailability): void {
    if (!seat.available) return;

    const idx = this.selectedSeats.findIndex(s => s.seatId === seat.seatId);
    if (idx > -1) {
      this.selectedSeats.splice(idx, 1);
    } else {
      this.selectedSeats.push(seat);
    }
  }

  isSelected(seat: SeatAvailability): boolean {
    return this.selectedSeats.some(s => s.seatId === seat.seatId);
  }

  get totalFare(): number {
    const farePerSeat = this.journey?.fare || 0;
    return farePerSeat * this.selectedSeats.length;
  }

  get selectedSeatNumbers(): string {
    return this.selectedSeats.map(s => s.seatNumber).join(', ');
  }

  proceedToBook(): void {
    if (this.selectedSeats.length === 0) {
      this.errorMessage = 'Please select at least one seat';
      return;
    }
    const firstSeat = this.selectedSeats[0];
    this.router.navigate(['/booking'], {
      queryParams: {
        journeyId: this.journeyId,
        seatId: firstSeat.seatId
      }
    });
  }

  getSeatRows(): (SeatAvailability | null)[][] {
    const rows: (SeatAvailability | null)[][] = [];
    const seatsPerRow = 4;
    for (let i = 0; i < this.seats.length; i += seatsPerRow) {
      const row: (SeatAvailability | null)[] = [];
      for (let j = 0; j < seatsPerRow; j++) {
        const idx = i + j;
        if (j === 2) {
          row.push(null);
        }
        if (idx < this.seats.length) {
          row.push(this.seats[idx]);
        } else if (j !== 2) {
          row.push(null);
        }
      }
      rows.push(row);
    }
    return rows;
  }

  logout(): void {
    clearAuthState();
    this.router.navigate(['/login']);
  }
}
