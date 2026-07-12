package com.transitops.service.impl;

import com.transitops.dto.response.DashboardResponseDTO;
import com.transitops.dto.response.DriverResponseDTO;
import com.transitops.dto.response.MaintenanceResponseDTO;
import com.transitops.enums.*;
import com.transitops.mapper.DriverMapper;
import com.transitops.mapper.MaintenanceMapper;
import com.transitops.repository.*;
import com.transitops.service.DashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardServiceImpl.class);

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final FuelLogRepository fuelLogRepository;
    private final ExpenseRepository expenseRepository;
    private final DriverMapper driverMapper;
    private final MaintenanceMapper maintenanceMapper;

    public DashboardServiceImpl(VehicleRepository vehicleRepository,
                                 DriverRepository driverRepository,
                                 TripRepository tripRepository,
                                 MaintenanceRepository maintenanceRepository,
                                 FuelLogRepository fuelLogRepository,
                                 ExpenseRepository expenseRepository,
                                 DriverMapper driverMapper,
                                 MaintenanceMapper maintenanceMapper) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.fuelLogRepository = fuelLogRepository;
        this.expenseRepository = expenseRepository;
        this.driverMapper = driverMapper;
        this.maintenanceMapper = maintenanceMapper;
    }

    @Override
    public DashboardResponseDTO getDashboardKPIs() {
        log.info("Computing dashboard KPIs");

        long totalVehicles = vehicleRepository.count();
        long availableVehicles = vehicleRepository.countByStatus(VehicleStatus.AVAILABLE);
        long vehiclesOnTrip = vehicleRepository.countByStatus(VehicleStatus.ON_TRIP);
        long vehiclesInShop = vehicleRepository.countByStatus(VehicleStatus.IN_SHOP);
        long retiredVehicles = vehicleRepository.countByStatus(VehicleStatus.RETIRED);
        double fleetUtilization = totalVehicles > 0
                ? Math.round(((double) vehiclesOnTrip / totalVehicles) * 10000.0) / 100.0
                : 0.0;

        long totalDrivers = driverRepository.count();
        long availableDrivers = driverRepository.countByStatus(DriverStatus.AVAILABLE);
        long driversOnTrip = driverRepository.countByStatus(DriverStatus.ON_TRIP);
        long suspendedDrivers = driverRepository.countByStatus(DriverStatus.SUSPENDED);

        LocalDate today = LocalDate.now();
        List<DriverResponseDTO> expiringDrivers = driverRepository
                .findDriversWithExpiringLicenses(today, today.plusDays(30))
                .stream().map(driverMapper::toDto).collect(Collectors.toList());

        long expiredLicenses = driverRepository.findDriversWithExpiredLicenses(today).size();

        long totalTrips = tripRepository.count();
        long activeTrips = tripRepository.countByStatus(TripStatus.DISPATCHED);
        long completedTrips = tripRepository.countByStatus(TripStatus.COMPLETED);
        long cancelledTrips = tripRepository.countByStatus(TripStatus.CANCELLED);

        Double totalDistance = tripRepository.sumTotalDistanceCovered();
        Double totalFuelConsumed = tripRepository.sumTotalFuelConsumed();

        long scheduledMaintenance = maintenanceRepository.countByStatus(MaintenanceStatus.SCHEDULED);
        long activeMaintenance = maintenanceRepository.countByStatus(MaintenanceStatus.ACTIVE);
        long completedMaintenance = maintenanceRepository.countByStatus(MaintenanceStatus.COMPLETED);
        Double maintenanceCost = maintenanceRepository.sumTotalMaintenanceCost();

        Double totalFuelCost = fuelLogRepository.sumTotalFuelCost();
        Double totalExpenses = expenseRepository.sumTotalExpenses();

        List<MaintenanceResponseDTO> upcomingMaintenance = maintenanceRepository
                .findUpcomingMaintenance(today, today.plusDays(7))
                .stream().map(maintenanceMapper::toDto).collect(Collectors.toList());

        return DashboardResponseDTO.builder()
                .totalVehicles(totalVehicles)
                .availableVehicles(availableVehicles)
                .vehiclesOnTrip(vehiclesOnTrip)
                .vehiclesInShop(vehiclesInShop)
                .retiredVehicles(retiredVehicles)
                .fleetUtilizationPercent(fleetUtilization)
                .totalDrivers(totalDrivers)
                .availableDrivers(availableDrivers)
                .driversOnTrip(driversOnTrip)
                .suspendedDrivers(suspendedDrivers)
                .driversWithExpiringLicenses(expiringDrivers.size())
                .driversWithExpiredLicenses(expiredLicenses)
                .totalTrips(totalTrips)
                .activeTrips(activeTrips)
                .completedTrips(completedTrips)
                .cancelledTrips(cancelledTrips)
                .totalDistanceCovered(totalDistance)
                .totalFuelConsumed(totalFuelConsumed)
                .scheduledMaintenance(scheduledMaintenance)
                .activeMaintenance(activeMaintenance)
                .completedMaintenance(completedMaintenance)
                .totalMaintenanceCost(maintenanceCost)
                .totalFuelCost(totalFuelCost)
                .totalExpenses(totalExpenses)
                .expiringLicenseDrivers(expiringDrivers)
                .upcomingMaintenance(upcomingMaintenance)
                .build();
    }
}
