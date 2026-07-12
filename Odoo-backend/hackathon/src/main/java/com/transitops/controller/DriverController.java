package com.transitops.controller;

import com.transitops.dto.request.DriverRequestDTO;
import com.transitops.dto.response.DriverResponseDTO;
import com.transitops.dto.response.MessageResponse;
import com.transitops.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @PostMapping
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN') or hasRole('SAFETY_OFFICER')")
    public ResponseEntity<DriverResponseDTO> createDriver(@Valid @RequestBody DriverRequestDTO requestDTO) {
        DriverResponseDTO createdDriver = driverService.createDriver(requestDTO);
        return new ResponseEntity<>(createdDriver, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN') or hasRole('SAFETY_OFFICER') or hasRole('DRIVER')")
    public ResponseEntity<Page<DriverResponseDTO>> getAllDrivers(Pageable pageable) {
        Page<DriverResponseDTO> drivers = driverService.getAllDrivers(pageable);
        return ResponseEntity.ok(drivers);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN') or hasRole('SAFETY_OFFICER') or hasRole('DRIVER')")
    public ResponseEntity<DriverResponseDTO> getDriverById(@PathVariable Long id) {
        DriverResponseDTO driver = driverService.getDriverById(id);
        return ResponseEntity.ok(driver);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN') or hasRole('SAFETY_OFFICER')")
    public ResponseEntity<DriverResponseDTO> updateDriver(@PathVariable Long id, @Valid @RequestBody DriverRequestDTO requestDTO) {
        DriverResponseDTO updatedDriver = driverService.updateDriver(id, requestDTO);
        return ResponseEntity.ok(updatedDriver);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN') or hasRole('SAFETY_OFFICER')")
    public ResponseEntity<MessageResponse> deleteDriver(@PathVariable Long id) {
        driverService.deleteDriver(id);
        return ResponseEntity.ok(new MessageResponse("Driver successfully deleted"));
    }
}
