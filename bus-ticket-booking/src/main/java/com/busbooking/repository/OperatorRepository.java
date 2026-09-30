package com.busbooking.repository;

import com.busbooking.entity.Operator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperatorRepository extends JpaRepository<Operator, Integer> {

    boolean existsByOperatorName(String operatorName);
}
