package com.busbooking.service;

import com.busbooking.dto.BookingRequest;
import com.busbooking.dto.BookingResponse;
import com.busbooking.entity.*;
import com.busbooking.repository.*;
import com.busbooking.security.JwtService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final JourneyRepository journeyRepository;
    private final BusRepository busRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final JwtService jwtService;

    public BookingService(BookingRepository bookingRepository,
                          SeatRepository seatRepository,
                          JourneyRepository journeyRepository,
                          BusRepository busRepository,
                          LocationRepository locationRepository,
                          UserRepository userRepository,
                          PaymentRepository paymentRepository,
                          JwtService jwtService) {
        this.bookingRepository = bookingRepository;
        this.seatRepository = seatRepository;
        this.journeyRepository = journeyRepository;
        this.busRepository = busRepository;
        this.locationRepository = locationRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.jwtService = jwtService;
    }

    @Transactional
    public Booking createBooking(BookingRequest request, String token) {
        String email = jwtService.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Journey journey = journeyRepository.findById(request.journeyId())
                .orElseThrow(() -> new RuntimeException("Journey not found"));

        if (journey.getStatus() != Journey.Status.SCHEDULED) {
            throw new RuntimeException("Journey must be SCHEDULED to book");
        }

        Seat seat = seatRepository.findById(request.seatId())
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        if (!seat.getBusId().equals(journey.getBusId())) {
            throw new RuntimeException("Seat does not belong to this journey's bus");
        }

        if (bookingRepository.existsByJourneyIdAndSeatIdAndStatusNot(
                request.journeyId(), request.seatId(), Booking.Status.CANCELLED)) {
            throw new RuntimeException("Seat already booked for this journey");
        }

        Booking booking = new Booking();
        booking.setUserId(user.getUserId());
        booking.setJourneyId(request.journeyId());
        booking.setSeatId(request.seatId());
        booking.setTotalAmount(journey.getFare());
        booking.setStatus(Booking.Status.PENDING);

        try {
            return bookingRepository.save(booking);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Seat booking conflict, please try another seat");
        }
    }

    public BookingResponse toBookingResponse(Booking booking) {
        User user = userRepository.findById(booking.getUserId()).orElse(null);
        Journey journey = journeyRepository.findById(booking.getJourneyId()).orElse(null);
        Bus bus = (journey != null) ? busRepository.findById(journey.getBusId()).orElse(null) : null;
        Location source = (journey != null) ? locationRepository.findById(journey.getSourceId()).orElse(null) : null;
        Location destination = (journey != null) ? locationRepository.findById(journey.getDestinationId()).orElse(null) : null;
        Seat seat = seatRepository.findById(booking.getSeatId()).orElse(null);
        Optional<Payment> paymentOpt = paymentRepository.findByBookingId(booking.getBookingId());
        Payment payment = paymentOpt.orElse(null);

        return new BookingResponse(
                booking.getBookingId(),
                booking.getUserId(),
                user != null ? user.getName() : null,
                booking.getJourneyId(),
                bus != null ? bus.getBusId() : null,
                bus != null ? bus.getBusNumber() : null,
                bus != null ? bus.getBusName() : null,
                source != null ? source.getCityName() : null,
                destination != null ? destination.getCityName() : null,
                journey != null ? journey.getDepartureTime() : null,
                journey != null ? journey.getArrivalTime() : null,
                journey != null ? journey.getTravelDate() : null,
                booking.getSeatId(),
                seat != null ? seat.getSeatNumber() : null,
                seat != null ? seat.getSeatType().name() : null,
                booking.getTotalAmount(),
                booking.getStatus().name(),
                payment != null ? payment.getPaymentStatus().name() : "NONE",
                payment != null ? payment.getTransactionId() : null
        );
    }

    public List<BookingResponse> getMyBookings(String token) {
        String email = jwtService.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> bookings = bookingRepository.findByUserId(user.getUserId());
        return bookings.stream()
                .sorted(Comparator.comparing(Booking::getBookingDate).reversed())
                .map(this::toBookingResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse cancelMyBooking(Integer bookingId, String token) {
        String email = jwtService.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findByBookingIdAndUserId(bookingId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == Booking.Status.CANCELLED) {
            throw new RuntimeException("Booking already cancelled");
        }

        Journey journey = journeyRepository.findById(booking.getJourneyId())
                .orElseThrow(() -> new RuntimeException("Journey not found"));

        if (journey.getStatus() == Journey.Status.COMPLETED || journey.getStatus() == Journey.Status.IN_PROGRESS) {
            throw new RuntimeException("Cannot cancel completed/in-progress journey booking");
        }

        booking.setStatus(Booking.Status.CANCELLED);
        bookingRepository.save(booking);

        return toBookingResponse(booking);
    }

    public List<BookingResponse> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream()
                .sorted(Comparator.comparing(Booking::getBookingDate).reversed())
                .map(this::toBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Integer id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        return toBookingResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBookingByAdmin(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        if (booking.getStatus() == Booking.Status.CANCELLED) {
            throw new RuntimeException("Booking already cancelled");
        }

        booking.setStatus(Booking.Status.CANCELLED);
        bookingRepository.save(booking);

        return toBookingResponse(booking);
    }
}
