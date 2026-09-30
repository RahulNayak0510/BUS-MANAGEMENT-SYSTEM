package com.busbooking.controller;

import com.busbooking.entity.Operator;
import com.busbooking.service.OperatorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operators")
@CrossOrigin(origins = "http://localhost:4200")
public class OperatorController {

    private final OperatorService operatorService;

    public OperatorController(OperatorService operatorService) {
        this.operatorService = operatorService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Operator> createOperator(
            @RequestBody Operator operator) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(operatorService.createOperator(operator));
    }

    @GetMapping
    public ResponseEntity<List<Operator>> getAllOperators() {
        return ResponseEntity.ok(
                operatorService.getAllOperators()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Operator> getOperatorById(
            @PathVariable Integer id) {
        return ResponseEntity.ok(
                operatorService.getOperatorById(id)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Operator> updateOperator(
            @PathVariable Integer id,
            @RequestBody Operator details) {
        return ResponseEntity.ok(
                operatorService.updateOperator(id, details)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOperator(
            @PathVariable Integer id) {
        operatorService.deleteOperator(id);
        return ResponseEntity.noContent().build();
    }
}
