import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService, Journey, BusV2, Location } from '../../services/api';

@Component({
  selector: 'app-admin-journeys',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './admin-journeys.html',
  styleUrl: './admin-journeys.css'
})
export class AdminJourneys implements OnInit {

  journeys: Journey[] = [];
  buses: BusV2[] = [];
  locations: Location[] = [];

  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  newJourney: Partial<Journey> = {
    busId: 0,
    sourceId: 0,
    destinationId: 0,
    departureTime: '',
    arrivalTime: '',
    travelDate: '',
    fare: 0,
    status: 'SCHEDULED'
  };

  submitting: boolean = false;
  cancellingId: number | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;

    this.apiService.getBusesV2().subscribe({
      next: (b) => { this.buses = b; },
      error: (e) => console.error('Failed to load buses:', e)
    });

    this.apiService.getLocations().subscribe({
      next: (l) => { this.locations = l; },
      error: (e) => console.error('Failed to load locations:', e)
    });

    this.loadJourneys();
  }

  loadJourneys(): void {
    this.apiService.getJourneys().subscribe({
      next: (j) => {
        this.journeys = j;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load journeys:', err);
        this.errorMessage = 'Failed to load journeys.';
        this.loading = false;
      }
    });
  }

  getBusName(id: number): string {
    const bus = this.buses.find(b => b.busId === id);
    return bus ? `${bus.busName} (#${bus.busNumber})` : `Bus #${id}`;
  }

  getLocationName(id: number): string {
    const loc = this.locations.find(l => l.locationId === id);
    return loc ? `${loc.cityName}` : `Location #${id}`;
  }

  createJourney(): void {
    this.errorMessage = '';

    if (!this.newJourney.busId) {
      this.errorMessage = 'Please select a bus';
      return;
    }
    if (!this.newJourney.sourceId || !this.newJourney.destinationId) {
      this.errorMessage = 'Please select source and destination';
      return;
    }
    if (this.newJourney.sourceId === this.newJourney.destinationId) {
      this.errorMessage = 'Source and destination must be different';
      return;
    }
    if (!this.newJourney.departureTime || !this.newJourney.arrivalTime || !this.newJourney.travelDate) {
      this.errorMessage = 'Please fill in all date/time fields';
      return;
    }
    if (!this.newJourney.fare || this.newJourney.fare <= 0) {
      this.errorMessage = 'Please enter a valid fare';
      return;
    }

    this.submitting = true;

    this.apiService.createJourney(this.newJourney as Journey).subscribe({
      next: (created) => {
        this.submitting = false;
        this.successMessage = 'Journey created successfully!';
        this.resetForm();
        this.loadJourneys();
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Failed to create journey.';
      }
    });
  }

  resetForm(): void {
    this.newJourney = {
      busId: this.buses.length > 0 ? (this.buses[0].busId ?? 0) : 0,
      sourceId: 0,
      destinationId: 0,
      departureTime: '',
      arrivalTime: '',
      travelDate: '',
      fare: 0,
      status: 'SCHEDULED'
    };
  }

  cancelJourney(id: number): void {
    if (!confirm('Cancel this journey? All associated bookings may be affected.')) return;

    this.cancellingId = id;
    this.apiService.cancelJourney(id).subscribe({
      next: () => {
        this.cancellingId = null;
        this.successMessage = 'Journey cancelled!';
        this.loadJourneys();
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.cancellingId = null;
        this.errorMessage = err.error?.message || 'Failed to cancel journey.';
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'SCHEDULED': return 'status-scheduled';
      case 'IN_PROGRESS': return 'status-progress';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  canCancel(journey: Journey): boolean {
    return journey.status !== 'CANCELLED' && journey.status !== 'COMPLETED';
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
