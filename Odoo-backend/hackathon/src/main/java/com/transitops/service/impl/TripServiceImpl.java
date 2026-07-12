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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripMapper tripMapper;

    @Override
    @Transactional
    public TripResponseDTO createTrip(TripRequestDTO requestDTO) {
        Vehicle vehicle = vehicleRepository.findById(requestDTO.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        
        Driver driver = driverRepository.findById(requestDTO.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        validateTripCreation(requestDTO, vehicle, driver);

        Trip trip = tripMapper.toEntity(requestDTO);
        trip.setVehicle(vehicle);
        trip.setDriver(driver);
        trip.setStatus(TripStatus.DRAFT);

        Trip savedTrip = tripRepository.save(trip);
        return tripMapper.toDto(savedTrip);
    }

    @Override
    @Transactional
    public TripResponseDTO updateTrip(Long id, TripRequestDTO requestDTO) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessValidationException("Only DRAFT trips can be updated.");
        }

        Vehicle vehicle = vehicleRepository.findById(requestDTO.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        
        Driver driver = driverRepository.findById(requestDTO.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        validateTripCreation(requestDTO, vehicle, driver);

        tripMapper.updateEntityFromDto(requestDTO, trip);
        trip.setVehicle(vehicle);
        trip.setDriver(driver);

        return tripMapper.toDto(tripRepository.save(trip));
    }

    @Override
    @Transactional
    public void deleteTrip(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessValidationException("Cannot delete trip unless it is in DRAFT status.");
        }
        tripRepository.delete(trip);
    }

    @Override
    public TripResponseDTO getTripById(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));
        return tripMapper.toDto(trip);
    }

    @Override
    public Page<TripResponseDTO> getAllTrips(Pageable pageable) {
        return tripRepository.findAll(pageable).map(tripMapper::toDto);
    }

    @Override
    @Transactional
    public TripResponseDTO dispatchTrip(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessValidationException("Only DRAFT trips can be dispatched.");
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new BusinessValidationException("Vehicle is not available for dispatch.");
        }
        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new BusinessValidationException("Driver is not available for dispatch.");
        }
        if (driver.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            throw new BusinessValidationException("Driver license is expired.");
        }

        vehicle.setStatus(VehicleStatus.ON_TRIP);
        driver.setStatus(DriverStatus.ON_TRIP);
        
        trip.setStatus(TripStatus.DISPATCHED);
        trip.setDispatchTime(LocalDateTime.now());

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);
        return tripMapper.toDto(tripRepository.save(trip));
    }

    @Override
    @Transactional
    public TripResponseDTO completeTrip(Long id, TripCompleteRequestDTO requestDTO) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (trip.getStatus() != TripStatus.DISPATCHED) {
            throw new BusinessValidationException("Only DISPATCHED trips can be completed.");
        }

        trip.setActualDistance(requestDTO.getActualDistance());
        trip.setFuelConsumed(requestDTO.getFuelConsumed());
        if (requestDTO.getRemarks() != null) {
            trip.setRemarks(requestDTO.getRemarks());
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        vehicle.setOdometerReading(requestDTO.getFinalOdometer());
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        driver.setStatus(DriverStatus.AVAILABLE);

        trip.setStatus(TripStatus.COMPLETED);
        trip.setCompletionTime(LocalDateTime.now());

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);
        return tripMapper.toDto(tripRepository.save(trip));
    }

    @Override
    @Transactional
    public TripResponseDTO cancelTrip(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (trip.getStatus() == TripStatus.COMPLETED) {
            throw new BusinessValidationException("Completed trips cannot be cancelled.");
        }
        if (trip.getStatus() == TripStatus.CANCELLED) {
            throw new BusinessValidationException("Trip is already cancelled.");
        }

        if (trip.getStatus() == TripStatus.DISPATCHED) {
            Vehicle vehicle = trip.getVehicle();
            Driver driver = trip.getDriver();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            driver.setStatus(DriverStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
            driverRepository.save(driver);
        }

        trip.setStatus(TripStatus.CANCELLED);
        return tripMapper.toDto(tripRepository.save(trip));
    }

    private void validateTripCreation(TripRequestDTO requestDTO, Vehicle vehicle, Driver driver) {
        if (requestDTO.getCargoWeight() > vehicle.getMaxLoadCapacity()) {
            throw new BusinessValidationException("Cargo weight exceeds vehicle max load capacity.");
        }
    }
}
