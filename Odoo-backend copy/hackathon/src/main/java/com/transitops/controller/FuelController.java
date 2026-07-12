package com.transitops.controller;

import com.transitops.dto.request.FuelLogRequestDTO;
import com.transitops.dto.response.FuelLogResponseDTO;
import com.transitops.service.FuelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fuel")
@Tag(name = "Fuel Logs", description = "Fuel Expense Logging APIs")
public class FuelController {

    private final FuelService fuelService;

    public FuelController(FuelService fuelService) {
        this.fuelService = fuelService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DRIVER', 'FINANCIAL_ANALYST')")
    @Operation(summary = "Add a fuel log entry")
    public ResponseEntity<FuelLogResponseDTO> addFuelLog(@Valid @RequestBody FuelLogRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fuelService.addFuelLog(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'FINANCIAL_ANALYST')")
    @Operation(summary = "Update a fuel log entry")
    public ResponseEntity<FuelLogResponseDTO> updateFuelLog(@PathVariable Long id,
                                                             @Valid @RequestBody FuelLogRequestDTO dto) {
        return ResponseEntity.ok(fuelService.updateFuelLog(id, dto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get fuel log by ID")
    public ResponseEntity<FuelLogResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(fuelService.getFuelLogById(id));
    }

    @GetMapping
    @Operation(summary = "Get all fuel logs")
    public ResponseEntity<List<FuelLogResponseDTO>> getAll() {
        return ResponseEntity.ok(fuelService.getAllFuelLogs());
    }

    @GetMapping("/vehicle/{vehicleId}")
    @Operation(summary = "Get fuel logs by vehicle")
    public ResponseEntity<List<FuelLogResponseDTO>> getByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(fuelService.getFuelLogsByVehicle(vehicleId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCIAL_ANALYST')")
    @Operation(summary = "Delete a fuel log entry")
    public ResponseEntity<Void> deleteFuelLog(@PathVariable Long id) {
        fuelService.deleteFuelLog(id);
        return ResponseEntity.noContent().build();
    }
}
