package com.transitops.service;

import com.transitops.dto.response.PredictiveMaintenanceResponseDTO;
import com.transitops.entity.Maintenance;
import com.transitops.entity.Vehicle;
import com.transitops.enums.MaintenanceStatus;
import com.transitops.repository.MaintenanceRepository;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MaintenancePredictionEngine {

    private final VehicleRepository vehicleRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final EmailService emailService;

    public PredictiveMaintenanceResponseDTO predictMaintenance(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + vehicleId));

        return calculatePrediction(vehicle);
    }

    public List<PredictiveMaintenanceResponseDTO> predictAll() {
        return vehicleRepository.findAll().stream()
                .map(this::calculatePrediction)
                .collect(Collectors.toList());
    }

    public List<PredictiveMaintenanceResponseDTO> getHighRiskVehicles() {
        return predictAll().stream()
                .filter(dto -> "HIGH".equals(dto.getRiskLevel()))
                .collect(Collectors.toList());
    }

    private PredictiveMaintenanceResponseDTO calculatePrediction(Vehicle vehicle) {
        List<Maintenance> history = maintenanceRepository.findByVehicleId(vehicle.getId());
        
        // Find last completed maintenance
        Optional<Maintenance> lastMaintenance = history.stream()
                .filter(m -> m.getStatus() == MaintenanceStatus.COMPLETED)
                .max(Comparator.comparing(Maintenance::getCompletedDate));

        Double lastServiceOdometer = lastMaintenance.map(Maintenance::getOdometerAtService).orElse(0.0);
        Double currentOdometer = vehicle.getOdometerReading();
        Double distanceSinceLastService = currentOdometer - lastServiceOdometer;
        if (distanceSinceLastService < 0) distanceSinceLastService = 0.0;

        // 1. Distance Score
        int distanceScore = 10;
        if (distanceSinceLastService > 10000) {
            distanceScore = 60;
        } else if (distanceSinceLastService >= 5000) {
            distanceScore = 30;
        }

        // 2. Fuel Efficiency Score (Mocked for now, until Fuel Anomaly module is fully linked)
        // Assuming a standard 10% drop for demonstration
        double fuelEfficiencyDrop = 10.0; 
        int fuelScore = 5;
        if (fuelEfficiencyDrop > 15) {
            fuelScore = 40;
        } else if (fuelEfficiencyDrop >= 5) {
            fuelScore = 20;
        }

        // 3. Maintenance History Score (Number of past repairs)
        long pastRepairs = history.stream().filter(m -> m.getStatus() == MaintenanceStatus.COMPLETED).count();
        int historyScore = 5;
        if (pastRepairs > 3) {
            historyScore = 30;
        } else if (pastRepairs >= 1) {
            historyScore = 15;
        }

        int totalRiskScore = distanceScore + fuelScore + historyScore;

        String riskLevel = "LOW";
        String recommendation = "Vehicle is operating normally.";
        if (totalRiskScore > 60) {
            riskLevel = "HIGH";
            recommendation = "Schedule maintenance immediately.";
        } else if (totalRiskScore > 30) {
            riskLevel = "MEDIUM";
            recommendation = "Plan maintenance soon.";
        }

        return PredictiveMaintenanceResponseDTO.builder()
                .vehicleId(vehicle.getId())
                .vehicleNumber(vehicle.getRegistrationNumber())
                .riskScore(totalRiskScore)
                .riskLevel(riskLevel)
                .distanceSinceLastService(distanceSinceLastService)
                .fuelEfficiencyDrop(fuelEfficiencyDrop)
                .recommendation(recommendation)
                .build();
    }

    // Runs every night at 2:00 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void evaluateFleetVehiclesNightly() {
        log.info("Starting nightly fleet maintenance prediction...");
        List<PredictiveMaintenanceResponseDTO> highRisk = getHighRiskVehicles();
        
        for (PredictiveMaintenanceResponseDTO alert : highRisk) {
            log.warn("High Risk Vehicle Detected: {}", alert.getVehicleNumber());
            String text = String.format(
                "Warning: Vehicle %s requires maintenance soon.\nRisk Score: %d%%\nDistance Since Last Service: %.2f km\nRecommendation: %s",
                alert.getVehicleNumber(), alert.getRiskScore(), alert.getDistanceSinceLastService(), alert.getRecommendation()
            );
            emailService.sendEmail("fleetmanager@transitops.com", "High Risk Vehicle Alert: " + alert.getVehicleNumber(), text);
        }
        log.info("Completed nightly fleet maintenance prediction.");
    }
}
