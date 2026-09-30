package com.busbooking.service;

import com.busbooking.dto.PaymentRequest;
import com.busbooking.dto.PaymentResponse;
import com.busbooking.entity.Booking;
import com.busbooking.entity.Payment;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final Random random = new Random();

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.bookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == Booking.Status.CONFIRMED || booking.getStatus() == Booking.Status.CANCELLED) {
            throw new RuntimeException("Booking not payable");
        }

        if (paymentRepository.existsByBookingId(request.bookingId())) {
            throw new RuntimeException("Payment already processed for this booking");
        }

        Payment.PaymentMethod paymentMethod;
        try {
            paymentMethod = Payment.PaymentMethod.valueOf(request.paymentMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid payment method");
        }

        Payment payment = new Payment();
        payment.setBookingId(booking.getBookingId());
        payment.setPaymentMethod(paymentMethod);
        payment.setAmount(booking.getTotalAmount());
        payment.setPaymentStatus(Payment.PaymentStatus.PENDING);

        payment.setPaymentStatus(Payment.PaymentStatus.SUCCESS);
        String transactionId = "TXN-" + System.currentTimeMillis() + "-" + String.format("%05d", random.nextInt(100000));
        payment.setTransactionId(transactionId);

        Payment savedPayment = paymentRepository.save(payment);

        booking.setStatus(Booking.Status.CONFIRMED);
        bookingRepository.save(booking);

        return new PaymentResponse(
                savedPayment.getPaymentId(),
                savedPayment.getBookingId(),
                savedPayment.getPaymentMethod().name(),
                savedPayment.getTransactionId(),
                savedPayment.getAmount(),
                savedPayment.getPaymentStatus().name(),
                savedPayment.getPaymentDate(),
                Booking.Status.CONFIRMED.name(),
                null
        );
    }
}
