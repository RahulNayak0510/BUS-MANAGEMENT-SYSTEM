package com.busbooking.service;

import com.busbooking.entity.Bus;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.OperatorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BusService {

    private final BusRepository busRepository;
    private final OperatorRepository operatorRepository;

    public BusService(BusRepository busRepository, OperatorRepository operatorRepository) {
        this.busRepository = busRepository;
        this.operatorRepository = operatorRepository;
    }

    public Bus createBus(Bus bus) {
        if (bus.getBusNumber() == null || bus.getBusNumber().isBlank()) {
            throw new RuntimeException("Bus number must not be blank");
        }
        if (bus.getBusName() == null || bus.getBusName().isBlank()) {
            throw new RuntimeException("Bus name must not be blank");
        }
        if (bus.getOperatorId() == null) {
            throw new RuntimeException("Operator ID must not be null");
        }
        if (!operatorRepository.existsById(bus.getOperatorId())) {
            throw new RuntimeException("Operator not found with ID: " + bus.getOperatorId());
        }
        if (bus.getTotalSeats() == null || bus.getTotalSeats() <= 0) {
            throw new RuntimeException("Total seats must be greater than 0");
        }
        if (bus.getBusType() == null) {
            throw new RuntimeException("Bus type must not be null");
        }
        if (busRepository.existsByBusNumber(bus.getBusNumber())) {
            throw new RuntimeException("Bus number already exists");
        }
        bus.setStatus(Bus.Status.ACTIVE);
        return busRepository.save(bus);
    }

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public Bus getBusById(Integer id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + id));
    }

    public Bus updateBus(Integer id, Bus details) {
        Bus existing = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + id));

        if (details.getOperatorId() != null) {
            if (!operatorRepository.existsById(details.getOperatorId())) {
                throw new RuntimeException("Operator not found with ID: " + details.getOperatorId());
            }
            existing.setOperatorId(details.getOperatorId());
        }

        if (details.getBusNumber() != null && !details.getBusNumber().isBlank()) {
            if (!details.getBusNumber().equals(existing.getBusNumber())) {
                if (busRepository.existsByBusNumber(details.getBusNumber())) {
                    throw new RuntimeException("Bus number already exists");
                }
            }
            existing.setBusNumber(details.getBusNumber());
        }

        if (details.getBusName() != null && !details.getBusName().isBlank()) {
            existing.setBusName(details.getBusName());
        }

        if (details.getBusType() != null) {
            existing.setBusType(details.getBusType());
        }

        if (details.getTotalSeats() != null) {
            if (details.getTotalSeats() <= 0) {
                throw new RuntimeException("Total seats must be greater than 0");
            }
            existing.setTotalSeats(details.getTotalSeats());
        }

        if (details.getStatus() != null) {
            existing.setStatus(details.getStatus());
        }

        return busRepository.save(existing);
    }

    public Bus deactivateBus(Integer id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + id));
        bus.setStatus(Bus.Status.INACTIVE);
        return busRepository.save(bus);
    }

    public Bus activateBus(Integer id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + id));
        bus.setStatus(Bus.Status.ACTIVE);
        return busRepository.save(bus);
    }

    public Optional<Bus> findByBusNumber(String busNumber) {
        return busRepository.findByBusNumber(busNumber);
    }
}
