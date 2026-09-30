package com.busbooking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Integer paymentId,
        Integer bookingId,
        String paymentMethod,
        String transactionId,
        BigDecimal amount,
        String paymentStatus,
        LocalDateTime paymentDate,
        String bookingStatus,
        Object bookingDetails) {
}
