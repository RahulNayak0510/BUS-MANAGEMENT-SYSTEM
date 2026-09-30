package com.busbooking.dto;

public record BookingRequest(
        Integer journeyId,
        Integer seatId) {
}
