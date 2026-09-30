package com.busbooking.dto;

public record SeatAvailabilityResponse(
        Integer seatId,
        String seatNumber,
        String seatType,
        boolean available) {
}
