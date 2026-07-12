package com.transitops.service.impl;

import com.transitops.dto.request.ExpenseRequestDTO;
import com.transitops.dto.response.ExpenseResponseDTO;
import com.transitops.entity.Expense;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.mapper.ExpenseMapper;
import com.transitops.repository.ExpenseRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.ExpenseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpenseServiceImpl implements ExpenseService {

    private static final Logger log = LoggerFactory.getLogger(ExpenseServiceImpl.class);

    private final ExpenseRepository expenseRepository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;
    private final ExpenseMapper expenseMapper;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository,
                               VehicleRepository vehicleRepository,
                               TripRepository tripRepository,
                               ExpenseMapper expenseMapper) {
        this.expenseRepository = expenseRepository;
        this.vehicleRepository = vehicleRepository;
        this.tripRepository = tripRepository;
        this.expenseMapper = expenseMapper;
    }

    @Override
    public ExpenseResponseDTO addExpense(ExpenseRequestDTO dto) {
        log.info("Adding expense: category={}, amount={}", dto.getCategory(), dto.getAmount());
        Vehicle vehicle = dto.getVehicleId() != null
                ? vehicleRepository.findById(dto.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", dto.getVehicleId()))
                : null;
        Trip trip = dto.getTripId() != null
                ? tripRepository.findById(dto.getTripId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", dto.getTripId()))
                : null;
        Expense expense = expenseMapper.toEntity(dto, vehicle, trip);
        Expense saved = expenseRepository.save(expense);
        return expenseMapper.toDto(saved);
    }

    @Override
    public ExpenseResponseDTO updateExpense(Long id, ExpenseRequestDTO dto) {
        log.info("Updating expense id: {}", id);
        Expense expense = getExpenseEntity(id);
        Vehicle vehicle = dto.getVehicleId() != null
                ? vehicleRepository.findById(dto.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", dto.getVehicleId()))
                : null;
        Trip trip = dto.getTripId() != null
                ? tripRepository.findById(dto.getTripId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", dto.getTripId()))
                : null;
        expense.setVehicle(vehicle);
        expense.setTrip(trip);
        expense.setCategory(dto.getCategory());
        expense.setAmount(dto.getAmount());
        expense.setDescription(dto.getDescription());
        expense.setDate(dto.getDate());
        expense.setVendor(dto.getVendor());
        expense.setReceiptNumber(dto.getReceiptNumber());
        expense.setNotes(dto.getNotes());
        return expenseMapper.toDto(expenseRepository.save(expense));
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseResponseDTO getExpenseById(Long id) {
        return expenseMapper.toDto(getExpenseEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponseDTO> getAllExpenses() {
        return expenseRepository.findAll()
                .stream()
                .map(expenseMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponseDTO> getExpensesByVehicle(Long vehicleId) {
        return expenseRepository.findByVehicleId(vehicleId)
                .stream()
                .map(expenseMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponseDTO> getExpensesByCategory(String category) {
        return expenseRepository.findByCategory(category)
                .stream()
                .map(expenseMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteExpense(Long id) {
        log.info("Deleting expense id: {}", id);
        expenseRepository.delete(getExpenseEntity(id));
    }

    private Expense getExpenseEntity(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));
    }
}
