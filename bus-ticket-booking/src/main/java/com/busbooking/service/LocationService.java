package com.busbooking.service;

import com.busbooking.entity.Location;
import com.busbooking.repository.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Location createLocation(Location location) {

        if (location.getCityName() == null || location.getCityName().isBlank()) {
            throw new RuntimeException("City name cannot be blank");
        }

        if (location.getState() == null || location.getState().isBlank()) {
            throw new RuntimeException("State cannot be blank");
        }

        if (locationRepository.existsByCityNameAndState(location.getCityName(), location.getState())) {
            throw new RuntimeException("Location with this city and state already exists");
        }

        return locationRepository.save(location);
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Location getLocationById(Integer id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));
    }

    public Location updateLocation(Integer id, Location details) {

        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        if (details.getCityName() == null || details.getCityName().isBlank()) {
            throw new RuntimeException("City name cannot be blank");
        }

        if (details.getState() == null || details.getState().isBlank()) {
            throw new RuntimeException("State cannot be blank");
        }

        boolean cityChanged = !details.getCityName().equals(location.getCityName());
        boolean stateChanged = !details.getState().equals(location.getState());

        if ((cityChanged || stateChanged) &&
                locationRepository.existsByCityNameAndState(details.getCityName(), details.getState())) {
            throw new RuntimeException("Location with this city and state already exists");
        }

        location.setCityName(details.getCityName());
        location.setState(details.getState());

        return locationRepository.save(location);
    }

    public void deleteLocation(Integer id) {
        if (!locationRepository.existsById(id)) {
            throw new RuntimeException("Location not found");
        }
        locationRepository.deleteById(id);
    }
}
