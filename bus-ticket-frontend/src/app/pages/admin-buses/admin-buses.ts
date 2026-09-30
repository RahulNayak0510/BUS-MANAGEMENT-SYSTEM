import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService, BusV2 } from '../../services/api';

@Component({
  selector: 'app-admin-buses',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './admin-buses.html',
  styleUrl: './admin-buses.css'
})
export class AdminBuses implements OnInit {

  buses: BusV2[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  editingId: number | null = null;
  editingBus: BusV2 = {
    operatorId: 0,
    busNumber: '',
    busName: '',
    busType: 'AC',
    totalSeats: 40,
    status: 'ACTIVE'
  };

  submitting: boolean = false;
  actionId: number | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBuses();
  }

  loadBuses(): void {
    this.loading = true;
    this.errorMessage = '';
    this.apiService.getBusesV2().subscribe({
      next: (buses) => {
        this.buses = buses;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load buses:', err);
        this.errorMessage = 'Failed to load buses.';
        this.loading = false;
      }
    });
  }

  startEdit(bus: BusV2): void {
    this.editingId = bus.busId ?? null;
    this.editingBus = { ...bus };
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(): void {
    if (!this.editingId) return;
    if (!this.editingBus.busNumber.trim() || !this.editingBus.busName.trim()) {
      this.errorMessage = 'Bus number and name are required';
      return;
    }

    this.submitting = true;
    this.apiService.updateBusV2(this.editingId, this.editingBus).subscribe({
      next: () => {
        this.submitting = false;
        this.editingId = null;
        this.successMessage = 'Bus updated successfully!';
        this.loadBuses();
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Failed to update bus.';
      }
    });
  }

  toggleStatus(bus: BusV2): void {
    if (!bus.busId) return;

    this.actionId = bus.busId;
    this.errorMessage = '';

    this.apiService.deactivateBus(bus.busId).subscribe({
      next: () => {
        this.actionId = null;
        this.successMessage = `Bus status updated!`;
        this.loadBuses();
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.actionId = null;
        this.errorMessage = err.error?.message || 'Failed to update bus status.';
      }
    });
  }

  manageSeats(busId: number): void {
    this.router.navigate(['/admin/seats', busId]);
  }

  getStatusClass(status: string): string {
    return status === 'ACTIVE' ? 'status-active' : 'status-inactive';
  }

  getBusTypeLabel(type: string): string {
    const map: Record<string, string> = {
      'AC': 'AC',
      'NON_AC': 'Non-AC',
      'SLEEPER': 'Sleeper',
      'SEMI_SLEEPER': 'Semi-Sleeper'
    };
    return map[type] || type;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
