package com.busbooking.service;

import com.busbooking.entity.Operator;
import com.busbooking.repository.OperatorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OperatorService {

    private final OperatorRepository operatorRepository;

    public OperatorService(OperatorRepository operatorRepository) {
        this.operatorRepository = operatorRepository;
    }

    public Operator createOperator(Operator operator) {
        if (operator.getOperatorName() == null || operator.getOperatorName().isBlank()) {
            throw new RuntimeException("Operator name is required");
        }
        return operatorRepository.save(operator);
    }

    public List<Operator> getAllOperators() {
        return operatorRepository.findAll();
    }

    public Operator getOperatorById(Integer id) {
        return operatorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Operator not found"));
    }

    public Operator updateOperator(Integer id, Operator details) {
        Operator existing = getOperatorById(id);
        if (details.getOperatorName() != null && !details.getOperatorName().isBlank()) {
            existing.setOperatorName(details.getOperatorName());
        }
        if (details.getContactNumber() != null) {
            existing.setContactNumber(details.getContactNumber());
        }
        if (details.getEmail() != null) {
            existing.setEmail(details.getEmail());
        }
        if (details.getAddress() != null) {
            existing.setAddress(details.getAddress());
        }
        return operatorRepository.save(existing);
    }

    public void deleteOperator(Integer id) {
        operatorRepository.deleteById(id);
    }
}
