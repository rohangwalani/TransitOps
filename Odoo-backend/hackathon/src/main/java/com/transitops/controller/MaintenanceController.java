package com.transitops.controller;

import com.transitops.dto.request.MaintenanceRequestDTO;
import com.transitops.dto.response.MaintenanceResponseDTO;
import com.transitops.enums.MaintenanceStatus;
import com.transitops.service.MaintenanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@Tag(name = "Maintenance", description = "Vehicle Maintenance Management APIs")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    @Operation(summary = "Schedule maintenance for a vehicle")
    public ResponseEntity<MaintenanceResponseDTO> scheduleMaintenance(@Valid @RequestBody MaintenanceRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(maintenanceService.scheduleMaintenance(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    @Operation(summary = "Update maintenance record")
    public ResponseEntity<MaintenanceResponseDTO> updateMaintenance(@PathVariable Long id,
                                                                     @Valid @RequestBody MaintenanceRequestDTO dto) {
        return ResponseEntity.ok(maintenanceService.updateMaintenance(id, dto));
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    @Operation(summary = "Activate maintenance - sets vehicle to IN_SHOP")
    public ResponseEntity<MaintenanceResponseDTO> activateMaintenance(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.activateMaintenance(id));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    @Operation(summary = "Complete maintenance - returns vehicle to AVAILABLE")
    public ResponseEntity<MaintenanceResponseDTO> completeMaintenance(@PathVariable Long id,
                                                                       @RequestParam(required = false) Double actualCost) {
        return ResponseEntity.ok(maintenanceService.completeMaintenance(id, actualCost));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get maintenance record by ID")
    public ResponseEntity<MaintenanceResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceById(id));
    }

    @GetMapping
    @Operation(summary = "Get all maintenance records")
    public ResponseEntity<List<MaintenanceResponseDTO>> getAll() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenance());
    }

    @GetMapping("/vehicle/{vehicleId}")
    @Operation(summary = "Get maintenance records by vehicle")
    public ResponseEntity<List<MaintenanceResponseDTO>> getByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByVehicle(vehicleId));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get maintenance records by status")
    public ResponseEntity<List<MaintenanceResponseDTO>> getByStatus(@PathVariable MaintenanceStatus status) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByStatus(status));
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming maintenance within N days")
    public ResponseEntity<List<MaintenanceResponseDTO>> getUpcoming(
            @RequestParam(defaultValue = "7") int daysAhead) {
        return ResponseEntity.ok(maintenanceService.getUpcomingMaintenance(daysAhead));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete maintenance record")
    public ResponseEntity<Void> deleteMaintenance(@PathVariable Long id) {
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.noContent().build();
    }
}
