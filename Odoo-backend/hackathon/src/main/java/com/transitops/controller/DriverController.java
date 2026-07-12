package com.transitops.controller;

import com.transitops.entity.Driver;
import com.transitops.service.DriverService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
@PreAuthorize("hasAnyRole('FLEET_MANAGER', 'DISPATCHER')")
@CrossOrigin(origins = "*")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping
    public ResponseEntity<?> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDriverById(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.getDriverById(id));
    }

    @PostMapping
    public ResponseEntity<?> createDriver(@RequestBody Driver driver) {
        Driver saved = driverService.createDriver(driver);
        return buildSuccessResponse("Driver created successfully", saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDriver(@PathVariable Long id, @RequestBody Driver driver) {
        Driver updated = driverService.updateDriver(id, driver);
        return buildSuccessResponse("Driver updated successfully", updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDriver(@PathVariable Long id) {
        driverService.deleteDriver(id);
        return buildSuccessResponse("Driver deleted successfully", null);
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
