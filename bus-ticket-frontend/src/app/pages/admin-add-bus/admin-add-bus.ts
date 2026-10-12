import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService, Operator, BusV2 } from '../../services/api';
import { clearAuthState } from '../../services/auth';

@Component({
  selector: 'app-admin-add-bus',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './admin-add-bus.html',
  styleUrl: './admin-add-bus.css'
})
export class AdminAddBus implements OnInit {

  operators: Operator[] = [];
  loadingOperators: boolean = false;

  bus: BusV2 = {
    operatorId: 0,
    busNumber: '',
    busName: '',
    busType: 'AC',
    totalSeats: 40,
    status: 'ACTIVE'
  };

  totalSeatsInput: number = 40;
  createdBus: BusV2 | null = null;

  errorMessage: string = '';
  successMessage: string = '';
  submitting: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOperators();
  }

  loadOperators(): void {
    this.loadingOperators = true;
    this.apiService.getOperators().subscribe({
      next: (ops) => {
        this.operators = ops;
        this.loadingOperators = false;
        if (ops.length > 0) {
          this.bus.operatorId = ops[0].operatorId ?? 0;
        }
      },
      error: (err) => {
        console.error('Failed to load operators:', err);
        this.errorMessage = 'Failed to load operators. Please add operators first.';
        this.loadingOperators = false;
      }
    });
  }

  saveBus(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.bus.operatorId) {
      this.errorMessage = 'Please select an operator';
      return;
    }
    if (!this.bus.busNumber.trim()) {
      this.errorMessage = 'Bus number is required';
      return;
    }
    if (!this.bus.busName.trim()) {
      this.errorMessage = 'Bus name is required';
      return;
    }
    if (!this.bus.totalSeats || this.bus.totalSeats < 1) {
      this.errorMessage = 'Total seats must be at least 1';
      return;
    }

    this.submitting = true;

    this.apiService.createBusV2(this.bus).subscribe({
      next: (created) => {
        this.submitting = false;
        this.createdBus = created;
        this.successMessage = 'Bus added successfully!';
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Failed to add bus. Please try again.';
      }
    });
  }

  generateSeatsAndGo(): void {
    if (!this.createdBus?.busId) return;
    this.router.navigate(['/admin/seats', this.createdBus.busId]);
  }

  resetForm(): void {
    this.bus = {
      operatorId: this.operators.length > 0 ? (this.operators[0].operatorId ?? 0) : 0,
      busNumber: '',
      busName: '',
      busType: 'AC',
      totalSeats: 40,
      status: 'ACTIVE'
    };
    this.totalSeatsInput = 40;
    this.createdBus = null;
  }

  logout(): void {
    clearAuthState();
    this.router.navigate(['/login']);
  }
}
