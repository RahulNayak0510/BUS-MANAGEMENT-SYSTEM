package com.busbooking.dto;

public record PaymentRequest(
        Integer bookingId,
        String paymentMethod) {
}
