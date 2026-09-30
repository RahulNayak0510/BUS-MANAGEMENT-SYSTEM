import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService, Location, JourneySearchResult } from '../../services/api';

@Component({
  selector: 'app-search-buses',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './search-buses.html',
  styleUrl: './search-buses.css'
})
export class SearchBuses implements OnInit {

  locations: Location[] = [];
  sourceId: number | null = null;
  destinationId: number | null = null;
  travelDate: string = '';

  searchResults: JourneySearchResult[] = [];
  searched: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.apiService.getLocations().subscribe({
      next: (locs) => {
        this.locations = locs;
      },
      error: (err) => {
        console.error('Failed to load locations:', err);
      }
    });
  }

  searchJourneys(): void {
    this.errorMessage = '';
    this.searched = true;

    if (!this.sourceId || !this.destinationId || !this.travelDate) {
      this.errorMessage = 'Please select source, destination, and date';
      this.searchResults = [];
      return;
    }

    if (this.sourceId === this.destinationId) {
      this.errorMessage = 'Source and destination must be different';
      this.searchResults = [];
      return;
    }

    this.loading = true;
    this.apiService.searchJourneys(this.sourceId, this.destinationId, this.travelDate).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.loading = false;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.errorMessage = err.error?.message || 'Failed to search buses. Please try again.';
        this.searchResults = [];
        this.loading = false;
      }
    });
  }

  selectSeats(journeyId: number): void {
    this.router.navigate(['/seat-selection'], { queryParams: { journeyId } });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
