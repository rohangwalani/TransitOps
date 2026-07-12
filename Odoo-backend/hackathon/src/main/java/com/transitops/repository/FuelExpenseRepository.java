package com.transitops.repository;

import com.transitops.entity.FuelExpense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuelExpenseRepository extends JpaRepository<FuelExpense, Long> {
}
