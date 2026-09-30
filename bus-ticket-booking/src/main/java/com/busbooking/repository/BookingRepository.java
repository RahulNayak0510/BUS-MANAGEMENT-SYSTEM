package com.busbooking.repository;

import com.busbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByUserId(Integer userId);

    List<Booking> findByJourneyId(Integer journeyId);

    List<Booking> findByJourneyIdAndStatusNot(Integer journeyId, Booking.Status status);

    boolean existsByJourneyIdAndSeatIdAndStatusNot(Integer journeyId, Integer seatId, Booking.Status status);

    Optional<Booking> findByBookingIdAndUserId(Integer bookingId, Integer userId);
}
