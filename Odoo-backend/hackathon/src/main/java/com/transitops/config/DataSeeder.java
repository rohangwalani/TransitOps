package com.transitops.config;

import com.transitops.entity.*;
import com.transitops.enums.*;
import com.transitops.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final FuelLogRepository fuelLogRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final ExpenseRepository expenseRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (vehicleRepository.count() > 0 && driverRepository.count() > 0) {
            log.info("Database already seeded with vehicles/drivers. Skipping dummy data generation.");
            return;
        }

        log.info("Starting database seeding with dummy data...");

        // 1. Create Users
        User admin = User.builder()
                .name("Admin User")
                .email("admin@transitops.com")
                .password(passwordEncoder.encode("admin123"))
                .phone("1234567890")
                .roles(Set.of(RoleType.ROLE_ADMIN))
                .build();
        userRepository.save(admin);

        // 2. Create Vehicles
        Vehicle vehicle1 = Vehicle.builder()
                .name("Volvo FH16")
                .registrationNumber("TRK-1001")
                .make("Volvo")
                .model("FH16")
                .year(2022)
                .type(VehicleType.HEAVY_DUTY)
                .status(VehicleStatus.AVAILABLE)
                .maxLoadCapacity(20000.0)
                .odometerReading(105000.0) // High enough to trigger maintenance if last service was 90000
                .acquisitionCost(150000.0)
                .latitude(19.0760)
                .longitude(72.8777)
                .build();
        vehicleRepository.save(vehicle1);

        Vehicle vehicle2 = Vehicle.builder()
                .name("Ford Transit")
                .registrationNumber("VAN-2002")
                .make("Ford")
                .model("Transit")
                .year(2023)
                .type(VehicleType.VAN)
                .status(VehicleStatus.AVAILABLE)
                .maxLoadCapacity(3000.0)
                .odometerReading(12000.0)
                .acquisitionCost(45000.0)
                .latitude(28.7041)
                .longitude(77.1025)
                .build();
        vehicleRepository.save(vehicle2);

        // 3. Create Drivers
        Driver driver1 = Driver.builder()
                .name("John Doe")
                .licenseNumber("DL-987654321")
                .licenseCategory("HC")
                .licenseExpiryDate(LocalDate.now().plusYears(2))
                .contactNumber("9876543210")
                .email("johndoe@transitops.com")
                .status(DriverStatus.AVAILABLE)
                .safetyScore(95)
                .totalTrips(150)
                .latitude(19.0760)
                .longitude(72.8777)
                .build();
        driverRepository.save(driver1);

        Driver driver2 = Driver.builder()
                .name("Jane Smith")
                .licenseNumber("DL-123456789")
                .licenseCategory("LC")
                .licenseExpiryDate(LocalDate.now().plusYears(1))
                .contactNumber("9123456780")
                .email("janesmith@transitops.com")
                .status(DriverStatus.ON_TRIP)
                .safetyScore(88)
                .totalTrips(45)
                .latitude(28.7041)
                .longitude(77.1025)
                .build();
        driverRepository.save(driver2);

        // 4. Create Trips
        Trip trip1 = Trip.builder()
                .source("Mumbai")
                .destination("Delhi")
                .vehicle(vehicle1)
                .driver(driver1)
                .cargoWeight(18000.0)
                .plannedDistance(1400.0)
                .actualDistance(1420.0)
                .fuelConsumed(350.0) // Avg: 4.05 km/L
                .status(TripStatus.COMPLETED)
                .startTime(LocalDateTime.now().minusDays(5))
                .endTime(LocalDateTime.now().minusDays(2))
                .build();
        tripRepository.save(trip1);

        Trip trip2 = Trip.builder()
                .source("Delhi")
                .destination("Jaipur")
                .vehicle(vehicle1)
                .driver(driver1)
                .cargoWeight(15000.0)
                .plannedDistance(280.0)
                .actualDistance(290.0)
                .fuelConsumed(100.0) // Avg: 2.9 km/L (Anomaly! Normal is 4.05)
                .status(TripStatus.COMPLETED)
                .startTime(LocalDateTime.now().minusDays(1))
                .endTime(LocalDateTime.now())
                .build();
        tripRepository.save(trip2);

        // 5. Create Fuel Logs
        FuelLog fuel1 = FuelLog.builder()
                .vehicle(vehicle1)
                .trip(trip1)
                .volumeLiters(350.0)
                .pricePerLiter(100.0)
                .totalCost(35000.0)
                .date(LocalDate.now().minusDays(4))
                .odometerReading(103000.0)
                .fuelStation("Shell Highway")
                .build();
        fuelLogRepository.save(fuel1);

        FuelLog fuel2 = FuelLog.builder()
                .vehicle(vehicle1)
                .trip(trip2)
                .volumeLiters(100.0)
                .pricePerLiter(100.0)
                .totalCost(10000.0)
                .date(LocalDate.now().minusDays(1))
                .odometerReading(104500.0)
                .fuelStation("Reliance Petrol")
                .build();
        fuelLogRepository.save(fuel2);

        // 6. Create Maintenance Records
        Maintenance maintenance1 = Maintenance.builder()
                .vehicle(vehicle1)
                .maintenanceType("Routine Service")
                .description("Oil change, brake inspection")
                .scheduledDate(LocalDate.now().minusMonths(3))
                .completedDate(LocalDate.now().minusMonths(3))
                .status(MaintenanceStatus.COMPLETED)
                .actualCost(12000.0)
                .odometerAtService(90000.0) // 105000 - 90000 = 15000 km since last service! (High Risk)
                .workshopName("Volvo Service Center")
                .deleted(false)
                .build();
        maintenanceRepository.save(maintenance1);

        log.info("Database seeding completed successfully.");
    }
}
