package com.busbooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public record PaymentRequest(
        @NotNull @Positive Integer bookingId,
        @NotBlank @Pattern(regexp = "(?i)^(UPI|CARD|NET_BANKING|CASH)$") String paymentMethod) {
}
