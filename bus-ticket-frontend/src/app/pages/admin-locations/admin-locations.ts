import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService, Location } from '../../services/api';
import { clearAuthState } from '../../services/auth';

@Component({
  selector: 'app-admin-locations',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './admin-locations.html',
  styleUrl: './admin-locations.css'
})
export class AdminLocations implements OnInit {

  locations: Location[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  newLocation: Location = {
    cityName: '',
    state: ''
  };

  editingId: number | null = null;
  editingLocation: Location = {
    cityName: '',
    state: ''
  };

  submitting: boolean = false;
  deletingId: number | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.loading = true;
    this.apiService.getLocations().subscribe({
      next: (locs) => {
        this.locations = locs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load locations:', err);
        this.errorMessage = 'Failed to load locations.';
        this.loading = false;
      }
    });
  }

  addLocation(): void {
    if (!this.newLocation.cityName.trim() || !this.newLocation.state.trim()) {
      this.errorMessage = 'City name and state are required';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    this.apiService.createLocation(this.newLocation).subscribe({
      next: (created) => {
        this.submitting = false;
        this.successMessage = 'Location added successfully!';
        this.newLocation = { cityName: '', state: '' };
        this.loadLocations();
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Failed to add location.';
      }
    });
  }

  startEdit(loc: Location): void {
    this.editingId = loc.locationId ?? null;
    this.editingLocation = { ...loc };
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(): void {
    if (!this.editingId) return;
    if (!this.editingLocation.cityName.trim() || !this.editingLocation.state.trim()) {
      this.errorMessage = 'City name and state are required';
      return;
    }

    this.submitting = true;
    this.apiService.updateLocation(this.editingId, this.editingLocation).subscribe({
      next: () => {
        this.submitting = false;
        this.editingId = null;
        this.successMessage = 'Location updated successfully!';
        this.loadLocations();
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Failed to update location.';
      }
    });
  }

  deleteLocation(id: number): void {
    if (!confirm('Are you sure you want to delete this location?')) return;

    this.deletingId = id;
    this.errorMessage = '';

    this.apiService.deleteLocation(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.successMessage = 'Location deleted successfully!';
        this.loadLocations();
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.deletingId = null;
        this.errorMessage = err.error?.message || 'Failed to delete location.';
      }
    });
  }

  logout(): void {
    clearAuthState();
    this.router.navigate(['/login']);
  }
}
