package com.transitops.service;

import com.transitops.dto.response.FuelAnomalyResponseDTO;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.enums.TripStatus;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FuelAnalyticsEngine {

    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;

    public FuelAnomalyResponseDTO analyzeFuel(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + vehicleId));

        return calculateFuelAnomaly(vehicle);
    }

    public List<FuelAnomalyResponseDTO> getAnomalies() {
        return vehicleRepository.findAll().stream()
                .map(this::calculateFuelAnomaly)
                .filter(dto -> "WARNING".equals(dto.getStatus()) || "CRITICAL".equals(dto.getStatus()))
                .collect(Collectors.toList());
    }

    public FuelAnomalyResponseDTO getVehicleStatistics(Long vehicleId) {
        return analyzeFuel(vehicleId);
    }

    private FuelAnomalyResponseDTO calculateFuelAnomaly(Vehicle vehicle) {
        List<Trip> completedTrips = tripRepository.findByVehicleId(vehicle.getId()).stream()
                .filter(t -> t.getStatus() == TripStatus.COMPLETED && t.getFuelConsumed() != null && t.getFuelConsumed() > 0 && t.getActualDistance() != null)
                .sorted(Comparator.comparing(Trip::getEndTime).reversed())
                .collect(Collectors.toList());

        if (completedTrips.isEmpty()) {
            return FuelAnomalyResponseDTO.builder()
                    .vehicleId(vehicle.getId())
                    .vehicleNumber(vehicle.getRegistrationNumber())
                    .historicalEfficiency(0.0)
                    .currentEfficiency(0.0)
                    .deviation(0.0)
                    .status("NORMAL")
                    .recommendation("Not enough data to analyze.")
                    .build();
        }

        // Calculate historical efficiency (excluding the most recent trip)
        List<Trip> historicalTrips = completedTrips.size() > 1 ? completedTrips.subList(1, completedTrips.size()) : completedTrips;
        double totalHistoricalDistance = historicalTrips.stream().mapToDouble(Trip::getActualDistance).sum();
        double totalHistoricalFuel = historicalTrips.stream().mapToDouble(Trip::getFuelConsumed).sum();
        
        double historicalEfficiency = totalHistoricalFuel > 0 ? totalHistoricalDistance / totalHistoricalFuel : 15.0; // Fallback to 15 km/L if no proper history

        // Current trip efficiency
        Trip currentTrip = completedTrips.get(0);
        double currentEfficiency = currentTrip.getActualDistance() / currentTrip.getFuelConsumed();

        // Deviation = (Historical - Current) / Historical * 100
        double deviation = 0.0;
        if (historicalEfficiency > 0) {
            deviation = ((historicalEfficiency - currentEfficiency) / historicalEfficiency) * 100;
        }

        String status = "NORMAL";
        String recommendation = "Fuel consumption is within normal ranges.";

        if (deviation > 20) {
            status = "CRITICAL";
            recommendation = "Review fuel logs immediately and inspect vehicle for fuel theft or severe performance issues.";
        } else if (deviation >= 10) {
            status = "WARNING";
            recommendation = "Fuel efficiency dropped. Monitor the next trips closely.";
        } else if (deviation < -20) {
            // Unusually high efficiency might indicate wrong data entry
            status = "WARNING";
            recommendation = "Unusually high fuel efficiency. Check fuel logs for missed entries.";
        }

        return FuelAnomalyResponseDTO.builder()
                .vehicleId(vehicle.getId())
                .vehicleNumber(vehicle.getRegistrationNumber())
                .historicalEfficiency(Math.round(historicalEfficiency * 100.0) / 100.0)
                .currentEfficiency(Math.round(currentEfficiency * 100.0) / 100.0)
                .deviation(Math.round(deviation * 100.0) / 100.0)
                .status(status)
                .recommendation(recommendation)
                .build();
    }
}
