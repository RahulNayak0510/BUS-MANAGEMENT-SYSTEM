package com.busbooking.controller;

import com.busbooking.dto.PaymentRequest;
import com.busbooking.dto.PaymentResponse;
import com.busbooking.entity.User;
import com.busbooking.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentResponse> processPayment(
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal User currentUser) {
        PaymentResponse response = paymentService.processPayment(request, currentUser.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentResponse> getPaymentByBookingId(
            @PathVariable Integer bookingId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(paymentService.getPaymentByBookingId(bookingId, currentUser.getUserId()));
    }
}
