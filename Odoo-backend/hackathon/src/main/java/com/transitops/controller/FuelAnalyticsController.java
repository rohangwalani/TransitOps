package com.transitops.controller;

import com.transitops.dto.response.FuelAnomalyResponseDTO;
import com.transitops.service.FuelAnalyticsEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fuel")
@RequiredArgsConstructor
public class FuelAnalyticsController {

    private final FuelAnalyticsEngine fuelAnalyticsEngine;

    @GetMapping("/analyze/{vehicleId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<FuelAnomalyResponseDTO> analyzeFuelLog(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(fuelAnalyticsEngine.analyzeFuel(vehicleId));
    }

    @GetMapping("/anomalies")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<List<FuelAnomalyResponseDTO>> getSuspiciousFuelLogs() {
        return ResponseEntity.ok(fuelAnalyticsEngine.getAnomalies());
    }

    @GetMapping("/statistics/{vehicleId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DRIVER')")
    public ResponseEntity<FuelAnomalyResponseDTO> getVehicleFuelStatistics(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(fuelAnalyticsEngine.getVehicleStatistics(vehicleId));
    }
}
