package com.transitops.service;

import com.transitops.dto.request.ExpenseRequestDTO;
import com.transitops.dto.response.ExpenseResponseDTO;

import java.util.List;

public interface ExpenseService {

    ExpenseResponseDTO addExpense(ExpenseRequestDTO dto);

    ExpenseResponseDTO updateExpense(Long id, ExpenseRequestDTO dto);

    ExpenseResponseDTO getExpenseById(Long id);

    List<ExpenseResponseDTO> getAllExpenses();

    List<ExpenseResponseDTO> getExpensesByVehicle(Long vehicleId);

    List<ExpenseResponseDTO> getExpensesByCategory(String category);

    void deleteExpense(Long id);
}
