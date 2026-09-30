package com.busbooking.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record JourneySearchResponse(
        Integer journeyId,
        Integer busId,
        String busNumber,
        String busName,
        Integer operatorId,
        String operatorName,
        String busType,
        Integer sourceId,
        String sourceCity,
        String sourceState,
        Integer destinationId,
        String destinationCity,
        String destinationState,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        LocalDate travelDate,
        BigDecimal fare,
        String journeyStatus,
        Integer availableSeats) {
}
