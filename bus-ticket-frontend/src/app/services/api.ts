import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Bus {
  busId?: number;
  busNumber: string;
  busName: string;
  busType: string;
  totalSeats: number;
  operatorName: string;
  active?: boolean;
}

export interface Operator {
  operatorId?: number;
  operatorName: string;
  contactNumber?: string;
  email?: string;
  address?: string;
}

export interface BusV2 {
  busId?: number;
  operatorId: number;
  busNumber: string;
  busName: string;
  busType: 'AC' | 'NON_AC' | 'SLEEPER' | 'SEMI_SLEEPER';
  totalSeats: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Seat {
  seatId?: number;
  busId: number;
  seatNumber: string;
  seatType: 'WINDOW' | 'AISLE' | 'SEMI_SLEEPER' | 'SLEEPER';
}

export interface SeatAvailability {
  seatId: number;
  seatNumber: string;
  seatType: string;
  available: boolean;
}

export interface Location {
  locationId?: number;
  cityName: string;
  state: string;
}

export interface Journey {
  journeyId?: number;
  busId: number;
  sourceId: number;
  destinationId: number;
  departureTime: string;
  arrivalTime: string;
  travelDate: string;
  fare: number;
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface JourneySearchResult {
  journeyId: number;
  busId: number;
  busNumber: string;
  busName: string;
  operatorId?: number;
  operatorName?: string;
  busType: string;
  sourceId: number;
  sourceCity: string;
  sourceState: string;
  destinationId: number;
  destinationCity: string;
  destinationState: string;
  departureTime: string;
  arrivalTime: string;
  travelDate: string;
  fare: number;
  journeyStatus: string;
  availableSeats: number;
}

export interface Booking {
  bookingId?: number;
  userId?: number;
  journeyId: number;
  seatId: number;
  bookingDate?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalAmount?: number;
}

export interface BookingDetails {
  bookingId: number;
  userId: number;
  userName: string;
  journeyId: number;
  busId: number;
  busNumber: string;
  busName: string;
  sourceCity: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  travelDate: string;
  seatId: number;
  seatNumber: string;
  seatType: string;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  transactionId?: string;
}

export interface PaymentRequest {
  bookingId: number;
  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH';
}

export interface PaymentResponse {
  paymentId: number;
  bookingId: number;
  paymentMethod: string;
  transactionId: string;
  amount: number;
  paymentStatus: string;
  paymentDate: string;
  bookingStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  addBus(bus: Bus): Observable<Bus> {
    return this.http.post<Bus>(
      `${this.baseUrl}/buses`,
      bus
    );
  }

  getBuses(): Observable<Bus[]> {
    return this.http.get<Bus[]>(
      `${this.baseUrl}/buses`
    );
  }

  deleteBus(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/buses/${id}`
    );
  }

  getOperators(): Observable<Operator[]> {
    return this.http.get<Operator[]>(`${this.baseUrl}/operators`);
  }

  getOperator(id: number): Observable<Operator> {
    return this.http.get<Operator>(`${this.baseUrl}/operators/${id}`);
  }

  createOperator(op: Operator): Observable<Operator> {
    return this.http.post<Operator>(`${this.baseUrl}/operators`, op);
  }

  updateOperator(id: number, op: Operator): Observable<Operator> {
    return this.http.put<Operator>(`${this.baseUrl}/operators/${id}`, op);
  }

  deleteOperator(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/operators/${id}`);
  }

  createBusV2(bus: BusV2): Observable<BusV2> {
    return this.http.post<BusV2>(`${this.baseUrl}/buses`, bus);
  }

  getBusesV2(): Observable<BusV2[]> {
    return this.http.get<BusV2[]>(`${this.baseUrl}/buses`);
  }

  getBusV2(id: number): Observable<BusV2> {
    return this.http.get<BusV2>(`${this.baseUrl}/buses/${id}`);
  }

  updateBusV2(id: number, bus: BusV2): Observable<BusV2> {
    return this.http.put<BusV2>(`${this.baseUrl}/buses/${id}`, bus);
  }

  deactivateBus(id: number): Observable<BusV2> {
    return this.http.put<BusV2>(`${this.baseUrl}/buses/${id}/deactivate`, {});
  }

  getSeats(busId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${this.baseUrl}/buses/${busId}/seats`);
  }

  createSeat(busId: number, seat: Seat): Observable<Seat> {
    return this.http.post<Seat>(`${this.baseUrl}/buses/${busId}/seats`, seat);
  }

  generateSeats(busId: number, totalSeats: number): Observable<Seat[]> {
    return this.http.post<Seat[]>(`${this.baseUrl}/buses/${busId}/seats/generate`, { totalSeats });
  }

  updateSeat(id: number, seat: Seat): Observable<Seat> {
    return this.http.put<Seat>(`${this.baseUrl}/seats/${id}`, seat);
  }

  deleteSeat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/seats/${id}`);
  }

  getSeatAvailability(journeyId: number): Observable<SeatAvailability[]> {
    return this.http.get<SeatAvailability[]>(`${this.baseUrl}/journeys/${journeyId}/seats/availability`);
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.baseUrl}/locations`);
  }

  createLocation(loc: Location): Observable<Location> {
    return this.http.post<Location>(`${this.baseUrl}/locations`, loc);
  }

  updateLocation(id: number, loc: Location): Observable<Location> {
    return this.http.put<Location>(`${this.baseUrl}/locations/${id}`, loc);
  }

  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/locations/${id}`);
  }

  getJourneys(): Observable<Journey[]> {
    return this.http.get<Journey[]>(`${this.baseUrl}/journeys`);
  }

  createJourney(j: Journey): Observable<Journey> {
    return this.http.post<Journey>(`${this.baseUrl}/journeys`, j);
  }

  updateJourney(id: number, j: Journey): Observable<Journey> {
    return this.http.put<Journey>(`${this.baseUrl}/journeys/${id}`, j);
  }

  cancelJourney(id: number): Observable<Journey> {
    return this.http.put<Journey>(`${this.baseUrl}/journeys/${id}/cancel`, {});
  }

  searchJourneys(sourceId: number, destinationId: number, travelDate: string): Observable<JourneySearchResult[]> {
    return this.http.get<JourneySearchResult[]>(
      `${this.baseUrl}/journeys/search?sourceId=${sourceId}&destinationId=${destinationId}&travelDate=${travelDate}`
    );
  }

  createBooking(journeyId: number, seatId: number): Observable<BookingDetails> {
    return this.http.post<BookingDetails>(`${this.baseUrl}/bookings`, { journeyId, seatId });
  }

  getMyBookings(): Observable<BookingDetails[]> {
    return this.http.get<BookingDetails[]>(`${this.baseUrl}/bookings/my`);
  }

  cancelMyBooking(id: number): Observable<BookingDetails> {
    return this.http.put<BookingDetails>(`${this.baseUrl}/bookings/${id}/cancel`, {});
  }

  getAllBookingsAdmin(): Observable<BookingDetails[]> {
    return this.http.get<BookingDetails[]>(`${this.baseUrl}/bookings/all`);
  }

  cancelBookingAdmin(id: number): Observable<BookingDetails> {
    return this.http.put<BookingDetails>(`${this.baseUrl}/bookings/${id}/admin-cancel`, {});
  }

  makePayment(req: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.baseUrl}/payments`, req);
  }
}
