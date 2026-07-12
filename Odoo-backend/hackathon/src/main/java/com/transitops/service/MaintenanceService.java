package com.transitops.service;

import com.transitops.entity.Maintenance;
import com.transitops.entity.Vehicle;
import com.transitops.enums.MaintenanceStatus;
import com.transitops.enums.VehicleStatus;
import com.transitops.repository.MaintenanceRepository;
import com.transitops.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository, VehicleRepository vehicleRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<Maintenance> getAllMaintenanceRecords() {
        return maintenanceRepository.findAll();
    }

    public Maintenance getMaintenanceById(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Maintenance record not found"));
    }

    @Transactional
    public Maintenance createMaintenance(Maintenance maintenance) {
        Vehicle vehicle = vehicleRepository.findById(maintenance.getVehicle().getId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        
        maintenance.setVehicle(vehicle);

        if (maintenance.getStatus() == MaintenanceStatus.IN_PROGRESS) {
            vehicle.setStatus(VehicleStatus.IN_SHOP);
            vehicleRepository.save(vehicle);
        }

        return maintenanceRepository.save(maintenance);
    }

    @Transactional
    public Maintenance updateMaintenanceStatus(Long id, MaintenanceStatus newStatus, Double finalCost) {
        Maintenance maintenance = getMaintenanceById(id);
        Vehicle vehicle = maintenance.getVehicle();

        if (newStatus == MaintenanceStatus.IN_PROGRESS) {
            if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
                throw new IllegalArgumentException("Cannot service a vehicle that is currently ON_TRIP");
            }
            vehicle.setStatus(VehicleStatus.IN_SHOP);
        } else if (newStatus == MaintenanceStatus.COMPLETED) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            maintenance.setCompletionDate(LocalDate.now());
            if (finalCost != null) {
                maintenance.setCost(finalCost);
            }
        }

        maintenance.setStatus(newStatus);
        vehicleRepository.save(vehicle);
        return maintenanceRepository.save(maintenance);
    }
}
