import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, Seat, BusV2 } from '../../services/api';

@Component({
  selector: 'app-admin-seats',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './admin-seats.html',
  styleUrl: './admin-seats.css'
})
export class AdminSeats implements OnInit {

  busId: number | null = null;
  bus: BusV2 | null = null;
  seats: Seat[] = [];

  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  totalSeatsInput: number = 40;
  generating: boolean = false;

  newSeat: Partial<Seat> = {
    seatNumber: '',
    seatType: 'WINDOW'
  };

  addingSeat: boolean = false;
  deletingId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.busId = params['busId'] ? +params['busId'] : null;
      if (this.busId) {
        this.loadBus();
        this.loadSeats();
      } else {
        this.errorMessage = 'No bus ID specified.';
      }
    });
  }

  loadBus(): void {
    if (!this.busId) return;
    this.apiService.getBusV2(this.busId).subscribe({
      next: (bus) => {
        this.bus = bus;
      },
      error: (err) => {
        console.error('Failed to load bus:', err);
      }
    });
  }

  loadSeats(): void {
    if (!this.busId) return;
    this.loading = true;
    this.apiService.getSeats(this.busId).subscribe({
      next: (seats) => {
        this.seats = seats;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load seats:', err);
        this.errorMessage = 'Failed to load seats.';
        this.loading = false;
      }
    });
  }

  generateSeats(): void {
    if (!this.busId) return;
    if (!this.totalSeatsInput || this.totalSeatsInput < 1) {
      this.errorMessage = 'Please enter a valid number of seats';
      return;
    }
    if (this.seats.length > 0 && !confirm('This will replace all existing seats. Continue?')) {
      return;
    }

    this.generating = true;
    this.errorMessage = '';

    this.apiService.generateSeats(this.busId, this.totalSeatsInput).subscribe({
      next: (seats) => {
        this.generating = false;
        this.successMessage = `Generated ${seats.length} seats successfully!`;
        this.seats = seats;
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.generating = false;
        this.errorMessage = err.error?.message || 'Failed to generate seats.';
      }
    });
  }

  addIndividualSeat(): void {
    if (!this.busId) return;
    if (!this.newSeat.seatNumber?.trim()) {
      this.errorMessage = 'Seat number is required';
      return;
    }

    this.addingSeat = true;
    this.errorMessage = '';

    const seat: Seat = {
      busId: this.busId,
      seatNumber: this.newSeat.seatNumber!,
      seatType: this.newSeat.seatType as any
    };

    this.apiService.createSeat(this.busId, seat).subscribe({
      next: (created) => {
        this.addingSeat = false;
        this.newSeat = { seatNumber: '', seatType: 'WINDOW' };
        this.successMessage = `Seat ${created.seatNumber} added!`;
        this.loadSeats();
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.addingSeat = false;
        this.errorMessage = err.error?.message || 'Failed to add seat.';
      }
    });
  }

  deleteSeat(id: number): void {
    if (!confirm('Delete this seat?')) return;

    this.deletingId = id;
    this.apiService.deleteSeat(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.successMessage = 'Seat deleted.';
        this.loadSeats();
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.deletingId = null;
        this.errorMessage = err.error?.message || 'Failed to delete seat.';
      }
    });
  }

  getSeatTypeLabel(type: string): string {
    const map: Record<string, string> = {
      'WINDOW': 'Window',
      'AISLE': 'Aisle',
      'SEMI_SLEEPER': 'Semi-Sleeper',
      'SLEEPER': 'Sleeper'
    };
    return map[type] || type;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
