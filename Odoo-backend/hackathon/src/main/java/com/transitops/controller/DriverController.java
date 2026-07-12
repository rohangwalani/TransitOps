package com.transitops.controller;

import com.transitops.dto.request.DriverRequestDTO;
import com.transitops.dto.response.DriverResponseDTO;
import com.transitops.enums.DriverStatus;
import com.transitops.service.DriverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@Tag(name = "Drivers", description = "Driver Management APIs")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    @Operation(summary = "Add a new driver")
    public ResponseEntity<DriverResponseDTO> createDriver(@Valid @RequestBody DriverRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(driverService.createDriver(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    @Operation(summary = "Update driver")
    public ResponseEntity<DriverResponseDTO> updateDriver(@PathVariable Long id,
                                                           @Valid @RequestBody DriverRequestDTO dto) {
        return ResponseEntity.ok(driverService.updateDriver(id, dto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get driver by ID")
    public ResponseEntity<DriverResponseDTO> getDriverById(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.getDriverById(id));
    }

    @GetMapping
    @Operation(summary = "Get all drivers")
    public ResponseEntity<List<DriverResponseDTO>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @GetMapping("/search")
    @Operation(summary = "Search and filter drivers with pagination")
    public ResponseEntity<Page<DriverResponseDTO>> searchDrivers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) DriverStatus status,
            @PageableDefault(size = 10, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(driverService.searchDrivers(search, status, pageable));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER')")
    @Operation(summary = "Update driver status")
    public ResponseEntity<DriverResponseDTO> updateStatus(@PathVariable Long id,
                                                           @RequestParam DriverStatus status) {
        return ResponseEntity.ok(driverService.updateDriverStatus(id, status));
    }

    @GetMapping("/expiring-licenses")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER')")
    @Operation(summary = "Get drivers with licenses expiring within N days")
    public ResponseEntity<List<DriverResponseDTO>> getExpiringLicenses(
            @RequestParam(defaultValue = "30") int daysAhead) {
        return ResponseEntity.ok(driverService.getDriversWithExpiringLicenses(daysAhead));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a driver")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        driverService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }
}
