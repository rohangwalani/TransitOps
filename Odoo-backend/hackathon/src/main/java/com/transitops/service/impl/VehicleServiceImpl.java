package com.transitops.service.impl;

import com.transitops.dto.request.VehicleRequestDTO;
import com.transitops.dto.response.VehicleResponseDTO;
import com.transitops.entity.Vehicle;
import com.transitops.enums.VehicleStatus;
import com.transitops.enums.VehicleType;
import com.transitops.exception.BusinessValidationException;
import com.transitops.exception.DuplicateResourceException;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.mapper.VehicleMapper;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.VehicleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private static final Logger log = LoggerFactory.getLogger(VehicleServiceImpl.class);

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, VehicleMapper vehicleMapper) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleMapper = vehicleMapper;
    }

    @Override
    public VehicleResponseDTO createVehicle(VehicleRequestDTO dto) {
        log.info("Creating vehicle with registration: {}", dto.getRegistrationNumber());
        if (vehicleRepository.existsByRegistrationNumber(dto.getRegistrationNumber())) {
            throw new DuplicateResourceException("Vehicle", "registrationNumber", dto.getRegistrationNumber());
        }
        Vehicle vehicle = vehicleMapper.toEntity(dto);
        Vehicle saved = vehicleRepository.save(vehicle);
        log.info("Vehicle created with id: {}", saved.getId());
        return vehicleMapper.toDto(saved);
    }

    @Override
    public VehicleResponseDTO updateVehicle(Long id, VehicleRequestDTO dto) {
        log.info("Updating vehicle id: {}", id);
        Vehicle vehicle = getVehicleEntity(id);
        if (!vehicle.getRegistrationNumber().equals(dto.getRegistrationNumber())) {
            if (vehicleRepository.existsByRegistrationNumber(dto.getRegistrationNumber())) {
                throw new DuplicateResourceException("Vehicle", "registrationNumber", dto.getRegistrationNumber());
            }
        }
        vehicleMapper.updateEntity(vehicle, dto);
        Vehicle saved = vehicleRepository.save(vehicle);
        return vehicleMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleResponseDTO getVehicleById(Long id) {
        return vehicleMapper.toDto(getVehicleEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponseDTO> getAllVehicles() {
        return vehicleRepository.findAll()
                .stream()
                .map(vehicleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VehicleResponseDTO> searchVehicles(String search, VehicleStatus status, VehicleType type, Pageable pageable) {
        return vehicleRepository.searchVehicles(search, status, type, pageable)
                .map(vehicleMapper::toDto);
    }

    @Override
    public void deleteVehicle(Long id) {
        log.info("Deleting vehicle id: {}", id);
        Vehicle vehicle = getVehicleEntity(id);
        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new BusinessValidationException("Cannot delete a vehicle that is currently ON_TRIP.");
        }
        vehicleRepository.delete(vehicle);
    }

    @Override
    public VehicleResponseDTO updateVehicleStatus(Long id, VehicleStatus status) {
        log.info("Updating vehicle {} status to {}", id, status);
        Vehicle vehicle = getVehicleEntity(id);
        vehicle.setStatus(status);
        return vehicleMapper.toDto(vehicleRepository.save(vehicle));
    }

    private Vehicle getVehicleEntity(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));
    }
}
