package com.busbooking.controller;

import com.busbooking.entity.Bus;
import com.busbooking.service.BusService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = "http://localhost:4200")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> createBus(@RequestBody Bus bus) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(busService.createBus(bus));
    }

    @GetMapping
    public ResponseEntity<List<Bus>> getAllBuses() {
        return ResponseEntity.ok(busService.getAllBuses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable Integer id) {
        return ResponseEntity.ok(busService.getBusById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> updateBus(@PathVariable Integer id, @RequestBody Bus details) {
        return ResponseEntity.ok(busService.updateBus(id, details));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> deleteBus(@PathVariable Integer id) {
        return ResponseEntity.ok(busService.deactivateBus(id));
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> deactivateBus(@PathVariable Integer id) {
        return ResponseEntity.ok(busService.deactivateBus(id));
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> activateBus(@PathVariable Integer id) {
        return ResponseEntity.ok(busService.activateBus(id));
    }
}
