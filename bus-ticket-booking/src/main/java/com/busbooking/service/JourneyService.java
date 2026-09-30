package com.busbooking.service;

import com.busbooking.dto.JourneySearchResponse;
import com.busbooking.entity.Booking;
import com.busbooking.entity.Bus;
import com.busbooking.entity.Journey;
import com.busbooking.entity.Location;
import com.busbooking.entity.Operator;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.JourneyRepository;
import com.busbooking.repository.LocationRepository;
import com.busbooking.repository.OperatorRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class JourneyService {

    private final JourneyRepository journeyRepository;
    private final BusRepository busRepository;
    private final LocationRepository locationRepository;
    private final OperatorRepository operatorRepository;
    private final BookingRepository bookingRepository;

    public JourneyService(JourneyRepository journeyRepository, BusRepository busRepository, LocationRepository locationRepository, OperatorRepository operatorRepository, BookingRepository bookingRepository) {
        this.journeyRepository = journeyRepository;
        this.busRepository = busRepository;
        this.locationRepository = locationRepository;
        this.operatorRepository = operatorRepository;
        this.bookingRepository = bookingRepository;
    }

    public Journey createJourney(Journey journey) {
        Bus bus = busRepository.findById(journey.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        if (bus.getStatus() != Bus.Status.ACTIVE) {
            throw new RuntimeException("Bus is not active");
        }

        if (!locationRepository.existsById(journey.getSourceId())) {
            throw new RuntimeException("Source location not found");
        }

        if (!locationRepository.existsById(journey.getDestinationId())) {
            throw new RuntimeException("Destination location not found");
        }

        if (journey.getSourceId().equals(journey.getDestinationId())) {
            throw new RuntimeException("Source and destination cannot be the same");
        }

        if (journey.getDepartureTime() == null) {
            throw new RuntimeException("Departure time cannot be null");
        }

        if (journey.getArrivalTime() == null) {
            throw new RuntimeException("Arrival time cannot be null");
        }

        if (!journey.getDepartureTime().isBefore(journey.getArrivalTime())) {
            throw new RuntimeException("Departure time must be before arrival time");
        }

        if (journey.getTravelDate() == null) {
            throw new RuntimeException("Travel date cannot be null");
        }

        if (journey.getFare() == null) {
            throw new RuntimeException("Fare cannot be null");
        }

        if (journey.getFare().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Fare cannot be negative");
        }

        journey.setStatus(Journey.Status.SCHEDULED);

        return journeyRepository.save(journey);
    }

    public List<Journey> getAllJourneys() {
        return journeyRepository.findAll();
    }

    public Journey getJourneyById(Integer id) {
        return journeyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Journey not found"));
    }

    public Journey updateJourney(Integer id, Journey details) {
        Journey journey = journeyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Journey not found"));

        if (details.getBusId() != null) {
            Bus bus = busRepository.findById(details.getBusId())
                    .orElseThrow(() -> new RuntimeException("Bus not found"));
            if (bus.getStatus() != Bus.Status.ACTIVE) {
                throw new RuntimeException("Bus is not active");
            }
            journey.setBusId(details.getBusId());
        }

        if (details.getSourceId() != null) {
            if (!locationRepository.existsById(details.getSourceId())) {
                throw new RuntimeException("Source location not found");
            }
            journey.setSourceId(details.getSourceId());
        }

        if (details.getDestinationId() != null) {
            if (!locationRepository.existsById(details.getDestinationId())) {
                throw new RuntimeException("Destination location not found");
            }
            journey.setDestinationId(details.getDestinationId());
        }

        if (journey.getSourceId() != null && journey.getDestinationId() != null
                && journey.getSourceId().equals(journey.getDestinationId())) {
            throw new RuntimeException("Source and destination cannot be the same");
        }

        if (details.getDepartureTime() != null) {
            journey.setDepartureTime(details.getDepartureTime());
        }

        if (details.getArrivalTime() != null) {
            journey.setArrivalTime(details.getArrivalTime());
        }

        if (journey.getDepartureTime() != null && journey.getArrivalTime() != null
                && !journey.getDepartureTime().isBefore(journey.getArrivalTime())) {
            throw new RuntimeException("Departure time must be before arrival time");
        }

        if (details.getTravelDate() != null) {
            journey.setTravelDate(details.getTravelDate());
        }

        if (details.getFare() != null) {
            if (details.getFare().compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("Fare cannot be negative");
            }
            journey.setFare(details.getFare());
        }

        if (details.getStatus() != null) {
            journey.setStatus(details.getStatus());
        }

        return journeyRepository.save(journey);
    }

    public Journey cancelJourney(Integer id) {
        Journey journey = journeyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Journey not found"));

        journey.setStatus(Journey.Status.CANCELLED);

        return journeyRepository.save(journey);
    }

    public List<Journey> searchJourneys(Integer sourceId, Integer destinationId, LocalDate travelDate) {
        return journeyRepository.searchJourneys(sourceId, destinationId, travelDate);
    }

    public List<JourneySearchResponse> searchJourneysDetailed(Integer sourceId, Integer destinationId, LocalDate travelDate) {
        List<Journey> journeys = journeyRepository.searchJourneys(sourceId, destinationId, travelDate);
        List<JourneySearchResponse> responses = new ArrayList<>();

        for (Journey journey : journeys) {
            Bus bus = busRepository.findById(journey.getBusId()).orElse(null);
            if (bus == null) {
                continue;
            }

            String operatorName = null;
            Optional<Operator> operatorOpt = operatorRepository.findById(bus.getOperatorId());
            if (operatorOpt.isPresent()) {
                operatorName = operatorOpt.get().getOperatorName();
            }

            Location source = locationRepository.findById(journey.getSourceId()).orElse(null);
            Location destination = locationRepository.findById(journey.getDestinationId()).orElse(null);

            List<Booking> activeBookings = bookingRepository.findByJourneyIdAndStatusNot(journey.getJourneyId(), Booking.Status.CANCELLED);
            Integer availableSeats = bus.getTotalSeats() - activeBookings.size();

            JourneySearchResponse response = new JourneySearchResponse(
                    journey.getJourneyId(),
                    bus.getBusId(),
                    bus.getBusNumber(),
                    bus.getBusName(),
                    bus.getOperatorId(),
                    operatorName,
                    bus.getBusType().name(),
                    journey.getSourceId(),
                    source != null ? source.getCityName() : null,
                    source != null ? source.getState() : null,
                    journey.getDestinationId(),
                    destination != null ? destination.getCityName() : null,
                    destination != null ? destination.getState() : null,
                    journey.getDepartureTime(),
                    journey.getArrivalTime(),
                    journey.getTravelDate(),
                    journey.getFare(),
                    journey.getStatus().name(),
                    availableSeats
            );
            responses.add(response);
        }

        return responses;
    }
}
