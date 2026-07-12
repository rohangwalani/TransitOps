package com.transitops.dto;

import lombok.Data;

@Data
public class DashboardDTO {
    private long totalVehicles;
    private long availableVehicles;
    private long vehiclesOnTrip;
    private long vehiclesInMaintenance;
    
    private long activeTrips;
    private long pendingTrips;
    
    private long driversAvailable;
    
    private double fleetUtilizationPercentage;
}
