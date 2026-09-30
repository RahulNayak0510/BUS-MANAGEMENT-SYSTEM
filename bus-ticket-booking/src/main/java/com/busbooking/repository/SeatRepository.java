package com.busbooking.repository;

import com.busbooking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Integer> {

    List<Seat> findByBusId(Integer busId);

    boolean existsByBusIdAndSeatNumber(Integer busId, String seatNumber);

    @Modifying
    @Query("DELETE FROM Seat s WHERE s.busId = :busId")
    void deleteByBusId(@Param("busId") Integer busId);
}
