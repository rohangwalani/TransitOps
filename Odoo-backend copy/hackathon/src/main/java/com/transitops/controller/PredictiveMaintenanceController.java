package com.transitops.controller;

import com.transitops.dto.response.PredictiveMaintenanceResponseDTO;
import com.transitops.service.MaintenancePredictionEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/maintenance")
@RequiredArgsConstructor
public class PredictiveMaintenanceController {

    private final MaintenancePredictionEngine predictionEngine;

    @GetMapping("/predict/{vehicleId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<PredictiveMaintenanceResponseDTO> predictMaintenance(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(predictionEngine.predictMaintenance(vehicleId));
    }

    @GetMapping("/predict")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<List<PredictiveMaintenanceResponseDTO>> predictAllVehicles() {
        return ResponseEntity.ok(predictionEngine.predictAll());
    }

    @GetMapping("/high-risk")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<List<PredictiveMaintenanceResponseDTO>> getHighRiskVehicles() {
        return ResponseEntity.ok(predictionEngine.getHighRiskVehicles());
    }
}
