package com.busbooking.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record BookingResponse(
        Integer bookingId,
        Integer userId,
        String userName,
        Integer journeyId,
        Integer busId,
        String busNumber,
        String busName,
        String sourceCity,
        String destinationCity,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        LocalDate travelDate,
        Integer seatId,
        String seatNumber,
        String seatType,
        BigDecimal totalAmount,
        String bookingStatus,
        String paymentStatus,
        String transactionId) {
}
