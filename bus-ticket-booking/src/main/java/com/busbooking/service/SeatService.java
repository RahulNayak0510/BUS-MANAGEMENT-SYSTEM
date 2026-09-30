package com.busbooking.service;

import com.busbooking.dto.SeatAvailabilityResponse;
import com.busbooking.entity.Booking;
import com.busbooking.entity.Journey;
import com.busbooking.entity.Seat;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.JourneyRepository;
import com.busbooking.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final JourneyRepository journeyRepository;
    private final BookingRepository bookingRepository;

    public SeatService(SeatRepository seatRepository, JourneyRepository journeyRepository, BookingRepository bookingRepository) {
        this.seatRepository = seatRepository;
        this.journeyRepository = journeyRepository;
        this.bookingRepository = bookingRepository;
    }

    public Seat createSeat(Seat seat) {
        if (seat.getBusId() == null) {
            throw new RuntimeException("Bus ID is required");
        }
        if (seat.getSeatNumber() == null || seat.getSeatNumber().trim().isEmpty()) {
            throw new RuntimeException("Seat number is required");
        }
        if (seat.getSeatType() == null) {
            throw new RuntimeException("Seat type is required");
        }
        if (seatRepository.existsByBusIdAndSeatNumber(seat.getBusId(), seat.getSeatNumber())) {
            throw new RuntimeException("Seat number already exists for this bus");
        }
        return seatRepository.save(seat);
    }

    public List<Seat> getSeatsByBusId(Integer busId) {
        return seatRepository.findByBusId(busId);
    }

    public Seat getSeatById(Integer id) {
        return seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + id));
    }

    public Seat updateSeat(Integer id, Seat details) {
        Seat existingSeat = getSeatById(id);

        if (details.getSeatNumber() != null && !details.getSeatNumber().trim().isEmpty()) {
            if (!existingSeat.getSeatNumber().equals(details.getSeatNumber())) {
                if (seatRepository.existsByBusIdAndSeatNumber(existingSeat.getBusId(), details.getSeatNumber())) {
                    throw new RuntimeException("Seat number already exists for this bus");
                }
                existingSeat.setSeatNumber(details.getSeatNumber());
            }
        }
        if (details.getSeatType() != null) {
            existingSeat.setSeatType(details.getSeatType());
        }

        return seatRepository.save(existingSeat);
    }

    public void deleteSeat(Integer id) {
        if (!seatRepository.existsById(id)) {
            throw new RuntimeException("Seat not found with id: " + id);
        }
        seatRepository.deleteById(id);
    }

    @Transactional
    public List<Seat> generateSeatsForBus(Integer busId, Integer totalSeats) {
        if (totalSeats == null || totalSeats <= 0) {
            throw new RuntimeException("Total seats must be a positive number");
        }

        List<Seat> seats = new ArrayList<>();
        char[] seatLetters = {'A', 'B', 'C', 'D'};

        int fullRows = totalSeats / 4;
        int remainingSeats = totalSeats % 4;

        for (int row = 1; row <= fullRows; row++) {
            for (int i = 0; i < 4; i++) {
                String seatNumber = row + String.valueOf(seatLetters[i]);
                Seat.SeatType seatType = (i == 0 || i == 3) ? Seat.SeatType.WINDOW : Seat.SeatType.AISLE;

                if (seatRepository.existsByBusIdAndSeatNumber(busId, seatNumber)) {
                    throw new RuntimeException("Duplicate seat number found: " + seatNumber + " for bus ID: " + busId);
                }

                Seat seat = new Seat();
                seat.setBusId(busId);
                seat.setSeatNumber(seatNumber);
                seat.setSeatType(seatType);
                seats.add(seat);
            }
        }

        if (remainingSeats > 0) {
            int row = fullRows + 1;
            for (int i = 0; i < remainingSeats; i++) {
                String seatNumber = row + String.valueOf(seatLetters[i]);
                Seat.SeatType seatType = (i == 0 || i == 3) ? Seat.SeatType.WINDOW : Seat.SeatType.AISLE;

                if (seatRepository.existsByBusIdAndSeatNumber(busId, seatNumber)) {
                    throw new RuntimeException("Duplicate seat number found: " + seatNumber + " for bus ID: " + busId);
                }

                Seat seat = new Seat();
                seat.setBusId(busId);
                seat.setSeatNumber(seatNumber);
                seat.setSeatType(seatType);
                seats.add(seat);
            }
        }

        return seatRepository.saveAll(seats);
    }

    @Transactional
    public void deleteSeatsByBusId(Integer busId) {
        seatRepository.deleteByBusId(busId);
    }

    public List<SeatAvailabilityResponse> getSeatAvailability(Integer journeyId) {
        Journey journey = journeyRepository.findById(journeyId)
                .orElseThrow(() -> new RuntimeException("Journey not found with id: " + journeyId));

        List<Seat> busSeats = seatRepository.findByBusId(journey.getBusId());

        List<Booking> activeBookings = bookingRepository.findByJourneyIdAndStatusNot(journeyId, Booking.Status.CANCELLED);

        Set<Integer> bookedSeatIds = activeBookings.stream()
                .map(Booking::getSeatId)
                .collect(Collectors.toSet());

        List<SeatAvailabilityResponse> availability = new ArrayList<>();
        for (Seat seat : busSeats) {
            boolean available = !bookedSeatIds.contains(seat.getSeatId());
            availability.add(new SeatAvailabilityResponse(
                    seat.getSeatId(),
                    seat.getSeatNumber(),
                    seat.getSeatType().name(),
                    available
            ));
        }

        return availability;
    }
}
