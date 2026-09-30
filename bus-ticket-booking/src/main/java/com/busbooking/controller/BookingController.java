package com.busbooking.controller;

import com.busbooking.dto.BookingRequest;
import com.busbooking.dto.BookingResponse;
import com.busbooking.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/api/bookings")
    public ResponseEntity<BookingResponse> createBooking(
            @RequestBody BookingRequest request,
            HttpServletRequest servletRequest) {

        String authHeader = servletRequest.getHeader("Authorization");
        String token = authHeader != null && authHeader.startsWith("Bearer ")
                ? authHeader.substring(7)
                : null;

        var saved = bookingService.createBooking(request, token);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(bookingService.toBookingResponse(saved));
    }

    @GetMapping("/api/bookings/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(HttpServletRequest servletRequest) {
        String authHeader = servletRequest.getHeader("Authorization");
        String token = authHeader != null && authHeader.startsWith("Bearer ")
                ? authHeader.substring(7)
                : null;

        return ResponseEntity.ok(bookingService.getMyBookings(token));
    }

    @PutMapping("/api/bookings/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelMyBooking(
            @PathVariable Integer id,
            HttpServletRequest servletRequest) {

        String authHeader = servletRequest.getHeader("Authorization");
        String token = authHeader != null && authHeader.startsWith("Bearer ")
                ? authHeader.substring(7)
                : null;

        return ResponseEntity.ok(bookingService.cancelMyBooking(id, token));
    }

    @GetMapping("/api/admin/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/api/admin/bookings/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PutMapping("/api/admin/bookings/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> cancelBookingByAdmin(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.cancelBookingByAdmin(id));
    }
}
