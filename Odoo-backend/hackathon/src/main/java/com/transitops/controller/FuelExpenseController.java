package com.transitops.controller;

import com.transitops.entity.FuelExpense;
import com.transitops.service.FuelExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@PreAuthorize("hasRole('FINANCIAL_ANALYST')")
@CrossOrigin(origins = "*")
public class FuelExpenseController {

    private final FuelExpenseService fuelExpenseService;

    public FuelExpenseController(FuelExpenseService fuelExpenseService) {
        this.fuelExpenseService = fuelExpenseService;
    }

    @GetMapping
    public ResponseEntity<?> getAllExpenses() {
        return ResponseEntity.ok(fuelExpenseService.getAllExpenses());
    }

    @PostMapping
    public ResponseEntity<?> createExpense(@RequestBody FuelExpense expense) {
        FuelExpense saved = fuelExpenseService.createExpense(expense);
        return buildSuccessResponse("Fuel Expense logged successfully", saved);
    }

    private ResponseEntity<?> buildSuccessResponse(String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        if (data != null) {
            response.put("data", data);
        }
        return ResponseEntity.ok(response);
    }
}
