package com.busbooking.repository;

import com.busbooking.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Integer> {

    boolean existsByCityNameAndState(String cityName, String state);

    List<Location> findByState(String state);
}
