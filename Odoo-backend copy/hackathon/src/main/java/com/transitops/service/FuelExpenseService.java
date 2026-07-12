package com.transitops.service;

import com.transitops.entity.FuelExpense;
import com.transitops.entity.Trip;
import com.transitops.repository.FuelExpenseRepository;
import com.transitops.repository.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FuelExpenseService {

    private final FuelExpenseRepository fuelExpenseRepository;
    private final TripRepository tripRepository;

    public FuelExpenseService(FuelExpenseRepository fuelExpenseRepository, TripRepository tripRepository) {
        this.fuelExpenseRepository = fuelExpenseRepository;
        this.tripRepository = tripRepository;
    }

    public List<FuelExpense> getAllExpenses() {
        return fuelExpenseRepository.findAll();
    }

    public FuelExpense getExpenseById(Long id) {
        return fuelExpenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));
    }

    @Transactional
    public FuelExpense createExpense(FuelExpense expense) {
        Trip trip = tripRepository.findById(expense.getTrip().getId())
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
        
        expense.setTrip(trip);
        // PrePersist handles the total calculation
        return fuelExpenseRepository.save(expense);
    }
}
