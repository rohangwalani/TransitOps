package com.transitops.service.impl;

import com.transitops.dto.request.TripCompleteRequestDTO;
import com.transitops.dto.request.TripRequestDTO;
import com.transitops.dto.response.TripResponseDTO;
import com.transitops.entity.Driver;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.enums.DriverStatus;
import com.transitops.enums.TripStatus;
import com.transitops.enums.VehicleStatus;
import com.transitops.exception.BusinessValidationException;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.mapper.TripMapper;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.TripService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TripServiceImpl implements TripService {

    private static final Logger log = LoggerFactory.getLogger(TripServiceImpl.class);

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripMapper tripMapper;

    public TripServiceImpl(TripRepository tripRepository,
                           VehicleRepository vehicleRepository,
                           DriverRepository driverRepository,
                           TripMapper tripMapper) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripMapper = tripMapper;
    }

    @Override
    public TripResponseDTO createTrip(TripRequestDTO dto) {
        log.info("Creating trip: {} -> {}", dto.getSource(), dto.getDestination());

        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", dto.getVehicleId()));

        Driver driver = driverRepository.findById(dto.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver", "id", dto.getDriverId()));

        // Business rule: cargo weight cannot exceed vehicle capacity
        if (dto.getCargoWeight() > vehicle.getMaxLoadCapacity()) {
            throw new BusinessValidationException(
                    String.format("Cargo weight (%.2f kg) exceeds vehicle max load capacity (%.2f kg).",
                            dto.getCargoWeight(), vehicle.getMaxLoadCapacity()));
        }

        Trip trip = Trip.builder()
                .source(dto.getSource())
                .destination(dto.getDestination())
                .vehicle(vehicle)
                .driver(driver)
                .cargoWeight(dto.getCargoWeight())
                .plannedDistance(dto.getPlannedDistance())
                .estimatedArrival(dto.getEstimatedArrival())
                .remarks(dto.getRemarks())
                .sourceLat(dto.getSourceLat())
                .sourceLng(dto.getSourceLng())
                .destLat(dto.getDestLat())
                .destLng(dto.getDestLng())
                .status(TripStatus.DRAFT)
                .build();

        Trip saved = tripRepository.save(trip);
        log.info("Trip created with id: {}", saved.getId());
        return tripMapper.toDto(saved);
    }

    @Override
    public TripResponseDTO dispatchTrip(Long id) {
        log.info("Dispatching trip id: {}", id);
        Trip trip = getTripEntity(id);

        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessValidationException("Only DRAFT trips can be dispatched. Current status: " + trip.getStatus());
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        // Business rules
        if (vehicle.getStatus() == VehicleStatus.RETIRED) {
            throw new BusinessValidationException("Cannot dispatch trip: Vehicle is RETIRED.");
        }
        if (vehicle.getStatus() == VehicleStatus.IN_SHOP) {
            throw new BusinessValidationException("Cannot dispatch trip: Vehicle is IN_SHOP for maintenance.");
        }
        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new BusinessValidationException("Cannot dispatch trip: Vehicle is not AVAILABLE. Current status: " + vehicle.getStatus());
        }
        if (driver.getStatus() == DriverStatus.SUSPENDED) {
            throw new BusinessValidationException("Cannot dispatch trip: Driver is SUSPENDED.");
        }
        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new BusinessValidationException("Cannot dispatch trip: Driver is not AVAILABLE. Current status: " + driver.getStatus());
        }
        if (driver.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            throw new BusinessValidationException("Cannot dispatch trip: Driver license has expired.");
        }

        // Transition statuses
        vehicle.setStatus(VehicleStatus.ON_TRIP);
        driver.setStatus(DriverStatus.ON_TRIP);
        trip.setStatus(TripStatus.DISPATCHED);
        trip.setStartTime(LocalDateTime.now());

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);
        Trip saved = tripRepository.save(trip);
        log.info("Trip {} dispatched successfully.", id);
        return tripMapper.toDto(saved);
    }

    @Override
    public TripResponseDTO completeTrip(Long id, TripCompleteRequestDTO dto) {
        log.info("Completing trip id: {}", id);
        Trip trip = getTripEntity(id);

        if (trip.getStatus() != TripStatus.DISPATCHED) {
            throw new BusinessValidationException("Only DISPATCHED trips can be completed. Current status: " + trip.getStatus());
        }

        // Update trip completion data
        trip.setActualDistance(dto.getActualDistance());
        trip.setFuelConsumed(dto.getFuelConsumed());
        trip.setStatus(TripStatus.COMPLETED);
        trip.setEndTime(LocalDateTime.now());
        if (dto.getRemarks() != null) {
            trip.setRemarks(dto.getRemarks());
        }

        // Restore vehicle and driver to available
        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicle.setOdometerReading(vehicle.getOdometerReading() + dto.getActualDistance());
        driver.setStatus(DriverStatus.AVAILABLE);
        driver.setTotalTrips(driver.getTotalTrips() + 1);

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);
        Trip saved = tripRepository.save(trip);
        log.info("Trip {} completed successfully.", id);
        return tripMapper.toDto(saved);
    }

    @Override
    public TripResponseDTO cancelTrip(Long id, String reason) {
        log.info("Cancelling trip id: {}", id);
        Trip trip = getTripEntity(id);

        if (trip.getStatus() == TripStatus.COMPLETED) {
            throw new BusinessValidationException("Cannot cancel a COMPLETED trip.");
        }
        if (trip.getStatus() == TripStatus.CANCELLED) {
            throw new BusinessValidationException("Trip is already CANCELLED.");
        }

        boolean wasDispatched = (trip.getStatus() == TripStatus.DISPATCHED);
        trip.setStatus(TripStatus.CANCELLED);
        trip.setRemarks(reason);
        trip.setEndTime(LocalDateTime.now());

        // Return vehicle and driver to available if was dispatched
        if (wasDispatched) {
            Vehicle vehicle = trip.getVehicle();
            Driver driver = trip.getDriver();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            driver.setStatus(DriverStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
            driverRepository.save(driver);
        }

        Trip saved = tripRepository.save(trip);
        log.info("Trip {} cancelled.", id);
        return tripMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public TripResponseDTO getTripById(Long id) {
        return tripMapper.toDto(getTripEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponseDTO> getAllTrips() {
        return tripRepository.findAll()
                .stream()
                .map(tripMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TripResponseDTO> searchTrips(String search, TripStatus status, Pageable pageable) {
        return tripRepository.searchTrips(search, status, pageable)
                .map(tripMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponseDTO> getTripsByVehicle(Long vehicleId) {
        return tripRepository.findByVehicleId(vehicleId)
                .stream()
                .map(tripMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponseDTO> getTripsByDriver(Long driverId) {
        return tripRepository.findByDriverId(driverId)
                .stream()
                .map(tripMapper::toDto)
                .collect(Collectors.toList());
    }

    private Trip getTripEntity(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", id));
    }
}
