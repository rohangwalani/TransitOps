package com.transitops.service.impl;

import com.transitops.dto.request.VehicleRequestDTO;
import com.transitops.dto.response.VehicleResponseDTO;
import com.transitops.entity.Vehicle;
import com.transitops.enums.VehicleStatus;
import com.transitops.exception.BusinessValidationException;
import com.transitops.exception.DuplicateResourceException;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.mapper.VehicleMapper;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;

    @Override
    @Transactional
    public VehicleResponseDTO createVehicle(VehicleRequestDTO requestDTO) {
        if (vehicleRepository.existsByRegistrationNumber(requestDTO.getRegistrationNumber())) {
            throw new DuplicateResourceException("Vehicle with registration number " + requestDTO.getRegistrationNumber() + " already exists.");
        }

        Vehicle vehicle = vehicleMapper.toEntity(requestDTO);
        if (vehicle.getStatus() == null) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
        }
        
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toDto(savedVehicle);
    }

    @Override
    @Transactional
    public VehicleResponseDTO updateVehicle(Long id, VehicleRequestDTO requestDTO) {
        Vehicle existingVehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        // Check if registration number is being changed to an existing one
        if (!existingVehicle.getRegistrationNumber().equals(requestDTO.getRegistrationNumber()) &&
                vehicleRepository.existsByRegistrationNumber(requestDTO.getRegistrationNumber())) {
            throw new DuplicateResourceException("Vehicle with registration number " + requestDTO.getRegistrationNumber() + " already exists.");
        }

        vehicleMapper.updateEntityFromDto(requestDTO, existingVehicle);
        if (requestDTO.getStatus() != null) {
            existingVehicle.setStatus(requestDTO.getStatus());
        }

        Vehicle updatedVehicle = vehicleRepository.save(existingVehicle);
        return vehicleMapper.toDto(updatedVehicle);
    }

    @Override
    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        
        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new BusinessValidationException("Cannot delete vehicle that is currently on a trip.");
        }
        
        // Soft delete could be implemented by setting status to RETIRED
        vehicle.setStatus(VehicleStatus.RETIRED);
        vehicleRepository.save(vehicle);
    }

    @Override
    public VehicleResponseDTO getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        return vehicleMapper.toDto(vehicle);
    }

    @Override
    public Page<VehicleResponseDTO> getAllVehicles(Pageable pageable) {
        return vehicleRepository.findAll(pageable)
                .map(vehicleMapper::toDto);
    }
}
