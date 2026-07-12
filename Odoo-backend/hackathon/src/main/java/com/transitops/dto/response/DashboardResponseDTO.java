package com.transitops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDTO {

    // Fleet KPIs
    private long totalVehicles;
    private long availableVehicles;
    private long vehiclesOnTrip;
    private long vehiclesInShop;
    private long retiredVehicles;
    private double fleetUtilizationPercent;

    // Driver KPIs
    private long totalDrivers;
    private long availableDrivers;
    private long driversOnTrip;
    private long suspendedDrivers;
    private long driversWithExpiringLicenses;
    private long driversWithExpiredLicenses;

    // Trip KPIs
    private long totalTrips;
    private long activeTrips;
    private long completedTrips;
    private long cancelledTrips;
    private Double totalDistanceCovered;
    private Double totalFuelConsumed;

    // Maintenance KPIs
    private long scheduledMaintenance;
    private long activeMaintenance;
    private long completedMaintenance;
    private Double totalMaintenanceCost;

    // Finance KPIs
    private Double totalFuelCost;
    private Double totalExpenses;

    // Alerts
    private List<DriverResponseDTO> expiringLicenseDrivers;
    private List<MaintenanceResponseDTO> upcomingMaintenance;
}
