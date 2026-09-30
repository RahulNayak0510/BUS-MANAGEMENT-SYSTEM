import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { SearchBuses } from './pages/search-buses/search-buses';
import { SeatSelection } from './pages/seat-selection/seat-selection';
import { Booking } from './pages/booking/booking';
import { MyBookings } from './pages/my-bookings/my-bookings';
import { AdminOperators } from './pages/admin-operators/admin-operators';
import { AdminAddBus } from './pages/admin-add-bus/admin-add-bus';
import { AdminBuses } from './pages/admin-buses/admin-buses';
import { AdminSeats } from './pages/admin-seats/admin-seats';
import { AdminLocations } from './pages/admin-locations/admin-locations';
import { AdminJourneys } from './pages/admin-journeys/admin-journeys';
import { AdminBookings } from './pages/admin-bookings/admin-bookings';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'user-dashboard',
    component: UserDashboard,
    canActivate: [AuthGuard]
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'search-buses',
    component: SearchBuses,
    canActivate: [AuthGuard]
  },

  {
    path: 'seat-selection',
    component: SeatSelection,
    canActivate: [AuthGuard]
  },

  {
    path: 'booking',
    component: Booking,
    canActivate: [AuthGuard]
  },

  {
    path: 'my-bookings',
    component: MyBookings,
    canActivate: [AuthGuard]
  },

  {
    path: 'admin/operators',
    component: AdminOperators,
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'admin/buses/add',
    component: AdminAddBus,
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'admin/buses',
    component: AdminBuses,
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'admin/seats/:busId',
    component: AdminSeats,
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'admin/locations',
    component: AdminLocations,
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'admin/journeys',
    component: AdminJourneys,
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'admin/bookings',
    component: AdminBookings,
    canActivate: [AuthGuard, AdminGuard]
  }

];
