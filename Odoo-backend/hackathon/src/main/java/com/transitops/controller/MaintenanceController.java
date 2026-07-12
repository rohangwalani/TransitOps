package com.transitops.controller;

import com.transitops.entity.Maintenance;
import com.transitops.enums.MaintenanceStatus;
import com.transitops.service.MaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
@PreAuthorize("hasRole('FLEET_MANAGER')")
@CrossOrigin(origins = "*")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public ResponseEntity<?> getAllMaintenanceRecords() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenanceRecords());
    }

    @PostMapping
    public ResponseEntity<?> createMaintenance(@RequestBody Maintenance maintenance) {
        Maintenance saved = maintenanceService.createMaintenance(maintenance);
        return buildSuccessResponse("Maintenance scheduled successfully", saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, 
                                          @RequestParam MaintenanceStatus status, 
                                          @RequestParam(required = false) Double cost) {
        Maintenance updated = maintenanceService.updateMaintenanceStatus(id, status, cost);
        return buildSuccessResponse("Maintenance status updated successfully", updated);
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
