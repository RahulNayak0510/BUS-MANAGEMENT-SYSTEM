package com.busbooking.repository;

import com.busbooking.entity.Journey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface JourneyRepository extends JpaRepository<Journey, Integer> {

    List<Journey> findByTravelDateAndStatus(LocalDate travelDate, Journey.Status status);

    List<Journey> findByBusIdAndTravelDate(Integer busId, LocalDate travelDate);

    @Query("SELECT j FROM Journey j WHERE j.sourceId = :sourceId AND j.destinationId = :destinationId AND j.travelDate = :travelDate AND j.status = 'SCHEDULED'")
    List<Journey> searchJourneys(@Param("sourceId") Integer sourceId, @Param("destinationId") Integer destinationId, @Param("travelDate") LocalDate travelDate);

    List<Journey> findAllByStatus(Journey.Status status);
}
