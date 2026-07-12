package com.transitops.service;

import com.transitops.dto.DashboardDTO;
import com.transitops.enums.DriverStatus;
import com.transitops.enums.TripStatus;
import com.transitops.enums.VehicleStatus;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    public DashboardService(VehicleRepository vehicleRepository, DriverRepository driverRepository, TripRepository tripRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
    }

    public DashboardDTO getDashboardStats() {
        DashboardDTO dto = new DashboardDTO();
        
        long totalVehicles = vehicleRepository.count();
        dto.setTotalVehicles(totalVehicles);
        dto.setAvailableVehicles(vehicleRepository.countByStatus(VehicleStatus.AVAILABLE));
        dto.setVehiclesOnTrip(vehicleRepository.countByStatus(VehicleStatus.ON_TRIP));
        dto.setVehiclesInMaintenance(vehicleRepository.countByStatus(VehicleStatus.IN_SHOP));
        
        dto.setActiveTrips(tripRepository.countByStatus(TripStatus.DISPATCHED));
        dto.setPendingTrips(tripRepository.countByStatus(TripStatus.DRAFT));
        
        dto.setDriversAvailable(driverRepository.countByStatus(DriverStatus.AVAILABLE));
        
        if (totalVehicles == 0) {
            dto.setFleetUtilizationPercentage(0.0);
        } else {
            // Utilization = (Vehicles on trip / Total vehicles) * 100
            double util = ((double) dto.getVehiclesOnTrip() / totalVehicles) * 100.0;
            dto.setFleetUtilizationPercentage(Math.round(util * 100.0) / 100.0); // round to 2 decimal places
        }
        
        return dto;
    }
}
