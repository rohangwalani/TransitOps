package com.transitops.service.impl;

import com.transitops.dto.request.MaintenanceRequestDTO;
import com.transitops.dto.response.MaintenanceResponseDTO;
import com.transitops.entity.Maintenance;
import com.transitops.entity.Vehicle;
import com.transitops.enums.MaintenanceStatus;
import com.transitops.enums.VehicleStatus;
import com.transitops.exception.BusinessValidationException;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.mapper.MaintenanceMapper;
import com.transitops.repository.MaintenanceRepository;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.MaintenanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MaintenanceServiceImpl implements MaintenanceService {

    private static final Logger log = LoggerFactory.getLogger(MaintenanceServiceImpl.class);

    private final MaintenanceRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;
    private final MaintenanceMapper maintenanceMapper;

    public MaintenanceServiceImpl(MaintenanceRepository maintenanceRepository,
                                   VehicleRepository vehicleRepository,
                                   MaintenanceMapper maintenanceMapper) {
        this.maintenanceRepository = maintenanceRepository;
        this.vehicleRepository = vehicleRepository;
        this.maintenanceMapper = maintenanceMapper;
    }

    @Override
    public MaintenanceResponseDTO scheduleMaintenance(MaintenanceRequestDTO dto) {
        log.info("Scheduling maintenance for vehicle id: {}", dto.getVehicleId());
        Vehicle vehicle = getVehicleEntity(dto.getVehicleId());
        Maintenance maintenance = maintenanceMapper.toEntity(dto, vehicle);
        Maintenance saved = maintenanceRepository.save(maintenance);
        return maintenanceMapper.toDto(saved);
    }

    @Override
    public MaintenanceResponseDTO updateMaintenance(Long id, MaintenanceRequestDTO dto) {
        log.info("Updating maintenance id: {}", id);
        Maintenance maintenance = getMaintenanceEntity(id);
        Vehicle vehicle = getVehicleEntity(dto.getVehicleId());
        maintenanceMapper.updateEntity(maintenance, dto, vehicle);
        return maintenanceMapper.toDto(maintenanceRepository.save(maintenance));
    }

    @Override
    public MaintenanceResponseDTO activateMaintenance(Long id) {
        log.info("Activating maintenance id: {}", id);
        Maintenance maintenance = getMaintenanceEntity(id);
        if (maintenance.getStatus() != MaintenanceStatus.SCHEDULED) {
            throw new BusinessValidationException("Only SCHEDULED maintenance can be activated. Current: " + maintenance.getStatus());
        }
        // Mark vehicle as IN_SHOP
        Vehicle vehicle = maintenance.getVehicle();
        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new BusinessValidationException("Cannot activate maintenance: Vehicle is ON_TRIP.");
        }
        vehicle.setStatus(VehicleStatus.IN_SHOP);
        vehicleRepository.save(vehicle);
        maintenance.setStatus(MaintenanceStatus.ACTIVE);
        return maintenanceMapper.toDto(maintenanceRepository.save(maintenance));
    }

    @Override
    public MaintenanceResponseDTO completeMaintenance(Long id, Double actualCost) {
        log.info("Completing maintenance id: {}", id);
        Maintenance maintenance = getMaintenanceEntity(id);
        if (maintenance.getStatus() != MaintenanceStatus.ACTIVE) {
            throw new BusinessValidationException("Only ACTIVE maintenance can be completed. Current: " + maintenance.getStatus());
        }
        maintenance.setStatus(MaintenanceStatus.COMPLETED);
        maintenance.setCompletedDate(LocalDate.now());
        if (actualCost != null) {
            maintenance.setActualCost(actualCost);
        }
        // Restore vehicle to AVAILABLE
        Vehicle vehicle = maintenance.getVehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicleRepository.save(vehicle);
        return maintenanceMapper.toDto(maintenanceRepository.save(maintenance));
    }

    @Override
    @Transactional(readOnly = true)
    public MaintenanceResponseDTO getMaintenanceById(Long id) {
        return maintenanceMapper.toDto(getMaintenanceEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceResponseDTO> getAllMaintenance() {
        return maintenanceRepository.findAll()
                .stream()
                .map(maintenanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceResponseDTO> getMaintenanceByVehicle(Long vehicleId) {
        return maintenanceRepository.findByVehicleId(vehicleId)
                .stream()
                .map(maintenanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceResponseDTO> getMaintenanceByStatus(MaintenanceStatus status) {
        return maintenanceRepository.findByStatus(status)
                .stream()
                .map(maintenanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceResponseDTO> getUpcomingMaintenance(int daysAhead) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(daysAhead);
        return maintenanceRepository.findUpcomingMaintenance(today, futureDate)
                .stream()
                .map(maintenanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteMaintenance(Long id) {
        log.info("Deleting maintenance id: {}", id);
        Maintenance maintenance = getMaintenanceEntity(id);
        if (maintenance.getStatus() == MaintenanceStatus.ACTIVE) {
            throw new BusinessValidationException("Cannot delete ACTIVE maintenance. Complete or cancel first.");
        }
        maintenanceRepository.delete(maintenance);
    }

    private Maintenance getMaintenanceEntity(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance", "id", id));
    }

    private Vehicle getVehicleEntity(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));
    }
}
