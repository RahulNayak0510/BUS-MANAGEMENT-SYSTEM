package com.busbooking.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record GenerateSeatsRequest(
        @NotNull @Positive Integer totalSeats) {
}
