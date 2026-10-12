import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService, Operator } from '../../services/api';
import { clearAuthState } from '../../services/auth';

@Component({
  selector: 'app-admin-operators',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './admin-operators.html',
  styleUrl: './admin-operators.css'
})
export class AdminOperators implements OnInit {

  operators: Operator[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  newOperator: Operator = {
    operatorName: '',
    contactNumber: '',
    email: '',
    address: ''
  };

  editingId: number | null = null;
  editingOperator: Operator = {
    operatorName: '',
    contactNumber: '',
    email: '',
    address: ''
  };

  submitting: boolean = false;
  deletingId: number | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOperators();
  }

  loadOperators(): void {
    this.loading = true;
    this.apiService.getOperators().subscribe({
      next: (ops) => {
        this.operators = ops;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load operators:', err);
        this.errorMessage = 'Failed to load operators.';
        this.loading = false;
      }
    });
  }

  addOperator(): void {
    if (!this.newOperator.operatorName.trim()) {
      this.errorMessage = 'Operator name is required';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    this.apiService.createOperator(this.newOperator).subscribe({
      next: (created) => {
        this.submitting = false;
        this.successMessage = 'Operator added successfully!';
        this.newOperator = { operatorName: '', contactNumber: '', email: '', address: '' };
        this.loadOperators();
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Failed to add operator.';
      }
    });
  }

  startEdit(op: Operator): void {
    this.editingId = op.operatorId ?? null;
    this.editingOperator = { ...op };
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(): void {
    if (!this.editingId) return;
    if (!this.editingOperator.operatorName.trim()) {
      this.errorMessage = 'Operator name is required';
      return;
    }

    this.submitting = true;
    this.apiService.updateOperator(this.editingId, this.editingOperator).subscribe({
      next: () => {
        this.submitting = false;
        this.editingId = null;
        this.successMessage = 'Operator updated successfully!';
        this.loadOperators();
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Failed to update operator.';
      }
    });
  }

  deleteOperator(id: number): void {
    if (!confirm('Are you sure you want to delete this operator?')) return;

    this.deletingId = id;
    this.errorMessage = '';

    this.apiService.deleteOperator(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.successMessage = 'Operator deleted successfully!';
        this.loadOperators();
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (err) => {
        this.deletingId = null;
        this.errorMessage = err.error?.message || 'Failed to delete operator.';
      }
    });
  }

  logout(): void {
    clearAuthState();
    this.router.navigate(['/login']);
  }
}
