package com.busbooking.controller;

import com.busbooking.dto.SeatAvailabilityResponse;
import com.busbooking.dto.GenerateSeatsRequest;
import com.busbooking.entity.Seat;
import com.busbooking.service.SeatService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @PostMapping("/api/buses/{busId}/seats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Seat> createSeat(
            @PathVariable Integer busId,
            @RequestBody Seat seat) {

        seat.setBusId(busId);
        Seat createdSeat = seatService.createSeat(seat);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdSeat);
    }

    @GetMapping("/api/buses/{busId}/seats")
    public ResponseEntity<List<Seat>> getSeatsByBusId(
            @PathVariable Integer busId) {

        List<Seat> seats = seatService.getSeatsByBusId(busId);
        return ResponseEntity.ok(seats);
    }

    @PostMapping("/api/buses/{busId}/seats/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Seat>> generateSeatsForBus(
            @PathVariable Integer busId,
            @Valid @RequestBody GenerateSeatsRequest request) {

        List<Seat> generatedSeats = seatService.generateSeatsForBus(busId, request.totalSeats());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(generatedSeats);
    }

    @PutMapping("/api/seats/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Seat> updateSeat(
            @PathVariable Integer id,
            @RequestBody Seat details) {

        Seat updatedSeat = seatService.updateSeat(id, details);
        return ResponseEntity.ok(updatedSeat);
    }

    @DeleteMapping("/api/seats/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSeat(
            @PathVariable Integer id) {

        seatService.deleteSeat(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/journeys/{journeyId}/seats/availability")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SeatAvailabilityResponse>> getSeatAvailability(@PathVariable Integer journeyId) {
        List<SeatAvailabilityResponse> availability = seatService.getSeatAvailability(journeyId);
        return ResponseEntity.ok(availability);
    }
}
