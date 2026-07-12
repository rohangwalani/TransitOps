package com.transitops.service.impl;

import com.transitops.dto.request.DriverRequestDTO;
import com.transitops.dto.response.DriverResponseDTO;
import com.transitops.entity.Driver;
import com.transitops.enums.DriverStatus;
import com.transitops.exception.BusinessValidationException;
import com.transitops.exception.DuplicateResourceException;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.mapper.DriverMapper;
import com.transitops.repository.DriverRepository;
import com.transitops.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper;

    @Override
    @Transactional
    public DriverResponseDTO createDriver(DriverRequestDTO requestDTO) {
        if (driverRepository.existsByLicenseNumber(requestDTO.getLicenseNumber())) {
            throw new DuplicateResourceException("Driver with license number " + requestDTO.getLicenseNumber() + " already exists.");
        }

        Driver driver = driverMapper.toEntity(requestDTO);
        if (driver.getStatus() == null) {
            driver.setStatus(DriverStatus.AVAILABLE);
        }
        if (driver.getSafetyScore() == null) {
            driver.setSafetyScore(100);
        }

        Driver savedDriver = driverRepository.save(driver);
        return driverMapper.toDto(savedDriver);
    }

    @Override
    @Transactional
    public DriverResponseDTO updateDriver(Long id, DriverRequestDTO requestDTO) {
        Driver existingDriver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));

        // Check unique license number if it's being updated
        if (!existingDriver.getLicenseNumber().equals(requestDTO.getLicenseNumber()) &&
                driverRepository.existsByLicenseNumber(requestDTO.getLicenseNumber())) {
            throw new DuplicateResourceException("Driver with license number " + requestDTO.getLicenseNumber() + " already exists.");
        }

        driverMapper.updateEntityFromDto(requestDTO, existingDriver);
        
        if (requestDTO.getStatus() != null) {
            existingDriver.setStatus(requestDTO.getStatus());
        }
        if (requestDTO.getSafetyScore() != null) {
            existingDriver.setSafetyScore(requestDTO.getSafetyScore());
        }

        Driver updatedDriver = driverRepository.save(existingDriver);
        return driverMapper.toDto(updatedDriver);
    }

    @Override
    @Transactional
    public void deleteDriver(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));

        if (driver.getStatus() == DriverStatus.ON_TRIP) {
            throw new BusinessValidationException("Cannot delete driver who is currently on a trip.");
        }

        // Hard delete or soft delete
        driverRepository.delete(driver);
    }

    @Override
    public DriverResponseDTO getDriverById(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
        return driverMapper.toDto(driver);
    }

    @Override
    public Page<DriverResponseDTO> getAllDrivers(Pageable pageable) {
        return driverRepository.findAll(pageable)
                .map(driverMapper::toDto);
    }
}
