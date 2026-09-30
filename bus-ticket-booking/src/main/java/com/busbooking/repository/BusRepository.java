package com.busbooking.repository;

import com.busbooking.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BusRepository extends JpaRepository<Bus, Integer> {

    boolean existsByBusNumber(String busNumber);

    Optional<Bus> findByBusNumber(String busNumber);
}