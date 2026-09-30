package com.busbooking.controller;

import com.busbooking.dto.JourneySearchResponse;
import com.busbooking.entity.Journey;
import com.busbooking.service.JourneyService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/journeys")
@CrossOrigin(origins = "http://localhost:4200")
public class JourneyController {

    private final JourneyService journeyService;

    public JourneyController(JourneyService journeyService) {
        this.journeyService = journeyService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Journey> createJourney(@RequestBody Journey journey) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(journeyService.createJourney(journey));
    }

    @GetMapping
    public ResponseEntity<List<Journey>> getAllJourneys() {
        return ResponseEntity.ok(journeyService.getAllJourneys());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Journey> getJourneyById(@PathVariable Integer id) {
        return ResponseEntity.ok(journeyService.getJourneyById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Journey>> searchJourneys(
            @RequestParam Integer sourceId,
            @RequestParam Integer destinationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate travelDate) {
        return ResponseEntity.ok(journeyService.searchJourneys(sourceId, destinationId, travelDate));
    }

    @GetMapping("/search/detailed")
    public ResponseEntity<List<JourneySearchResponse>> searchJourneysDetailed(
            @RequestParam Integer sourceId,
            @RequestParam Integer destinationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate travelDate) {
        return ResponseEntity.ok(journeyService.searchJourneysDetailed(sourceId, destinationId, travelDate));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Journey> updateJourney(@PathVariable Integer id, @RequestBody Journey details) {
        return ResponseEntity.ok(journeyService.updateJourney(id, details));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Journey> cancelJourney(@PathVariable Integer id) {
        return ResponseEntity.ok(journeyService.cancelJourney(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteJourney(@PathVariable Integer id) {
        journeyService.cancelJourney(id);
        return ResponseEntity.noContent().build();
    }
}
