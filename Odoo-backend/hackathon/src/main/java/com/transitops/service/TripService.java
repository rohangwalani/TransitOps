package com.transitops.service;

import com.transitops.entity.Driver;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.enums.DriverStatus;
import com.transitops.enums.TripStatus;
import com.transitops.enums.VehicleStatus;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public TripService(TripRepository tripRepository, VehicleRepository vehicleRepository, DriverRepository driverRepository) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
    }

    @Transactional
    public Trip createTrip(Trip trip) {
        // Generate automatic tripCode
        String code = "TRP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        trip.setTripCode(code);
        trip.setStatus(TripStatus.DRAFT);

        // Fetch strict references from DB to prevent transient object issues
        Vehicle vehicle = vehicleRepository.findById(trip.getVehicle().getId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        Driver driver = driverRepository.findById(trip.getDriver().getId())
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));

        trip.setVehicle(vehicle);
        trip.setDriver(driver);

        return tripRepository.save(trip);
    }

    @Transactional
    public Trip dispatchTrip(Long tripId) {
        Trip trip = getTripById(tripId);

        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new IllegalArgumentException("Only DRAFT trips can be dispatched");
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        // 1. Vehicle Validations
        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new IllegalArgumentException("Vehicle is not AVAILABLE. Current status: " + vehicle.getStatus());
        }
        if (trip.getCargoWeight() > vehicle.getCapacity()) {
            throw new IllegalArgumentException("Cargo weight (" + trip.getCargoWeight() + ") exceeds vehicle capacity (" + vehicle.getCapacity() + ")");
        }

        // 2. Driver Validations
        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new IllegalArgumentException("Driver is not AVAILABLE. Current status: " + driver.getStatus());
        }
        if (driver.getLicenseExpiry().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Driver license is expired!");
        }

        // 3. Dispatch Operations (Automated State Transitions)
        trip.setStatus(TripStatus.DISPATCHED);
        trip.setDispatchTime(LocalDateTime.now());
        vehicle.setStatus(VehicleStatus.ON_TRIP);
        driver.setStatus(DriverStatus.ON_TRIP);

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip completeTrip(Long tripId, Double actualDistance) {
        Trip trip = getTripById(tripId);

        if (trip.getStatus() != TripStatus.DISPATCHED) {
            throw new IllegalArgumentException("Only DISPATCHED trips can be completed");
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        // Complete Operations (Automated State Transitions)
        trip.setStatus(TripStatus.COMPLETED);
        trip.setCompletionTime(LocalDateTime.now());
        if (actualDistance != null) {
            trip.setActualDistance(actualDistance);
        }

        vehicle.setStatus(VehicleStatus.AVAILABLE);
        driver.setStatus(DriverStatus.AVAILABLE);

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip cancelTrip(Long tripId) {
        Trip trip = getTripById(tripId);

        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new IllegalArgumentException("Only DRAFT trips can be cancelled without manual intervention");
        }

        trip.setStatus(TripStatus.CANCELLED);
        return tripRepository.save(trip);
    }
    
    public void deleteTrip(Long id) {
        Trip trip = getTripById(id);
        if (trip.getStatus() == TripStatus.DISPATCHED) {
            throw new IllegalArgumentException("Cannot delete an active trip");
        }
        tripRepository.delete(trip);
    }
}
