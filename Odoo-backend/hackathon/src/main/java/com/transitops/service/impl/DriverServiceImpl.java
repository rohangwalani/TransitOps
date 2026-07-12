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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DriverServiceImpl implements DriverService {

    private static final Logger log = LoggerFactory.getLogger(DriverServiceImpl.class);

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper;

    public DriverServiceImpl(DriverRepository driverRepository, DriverMapper driverMapper) {
        this.driverRepository = driverRepository;
        this.driverMapper = driverMapper;
    }

    @Override
    public DriverResponseDTO createDriver(DriverRequestDTO dto) {
        log.info("Creating driver with license: {}", dto.getLicenseNumber());
        if (driverRepository.existsByLicenseNumber(dto.getLicenseNumber())) {
            throw new DuplicateResourceException("Driver", "licenseNumber", dto.getLicenseNumber());
        }
        Driver driver = driverMapper.toEntity(dto);
        Driver saved = driverRepository.save(driver);
        log.info("Driver created with id: {}", saved.getId());
        return driverMapper.toDto(saved);
    }

    @Override
    public DriverResponseDTO updateDriver(Long id, DriverRequestDTO dto) {
        log.info("Updating driver id: {}", id);
        Driver driver = getDriverEntity(id);
        if (!driver.getLicenseNumber().equals(dto.getLicenseNumber())) {
            if (driverRepository.existsByLicenseNumber(dto.getLicenseNumber())) {
                throw new DuplicateResourceException("Driver", "licenseNumber", dto.getLicenseNumber());
            }
        }
        driverMapper.updateEntity(driver, dto);
        Driver saved = driverRepository.save(driver);
        return driverMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DriverResponseDTO getDriverById(Long id) {
        return driverMapper.toDto(getDriverEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverResponseDTO> getAllDrivers() {
        return driverRepository.findAll()
                .stream()
                .map(driverMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DriverResponseDTO> searchDrivers(String search, DriverStatus status, Pageable pageable) {
        return driverRepository.searchDrivers(search, status, pageable)
                .map(driverMapper::toDto);
    }

    @Override
    public void deleteDriver(Long id) {
        log.info("Deleting driver id: {}", id);
        Driver driver = getDriverEntity(id);
        if (driver.getStatus() == DriverStatus.ON_TRIP) {
            throw new BusinessValidationException("Cannot delete a driver that is currently ON_TRIP.");
        }
        driverRepository.delete(driver);
    }

    @Override
    public DriverResponseDTO updateDriverStatus(Long id, DriverStatus status) {
        log.info("Updating driver {} status to {}", id, status);
        Driver driver = getDriverEntity(id);
        driver.setStatus(status);
        return driverMapper.toDto(driverRepository.save(driver));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverResponseDTO> getDriversWithExpiringLicenses(int daysAhead) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(daysAhead);
        return driverRepository.findDriversWithExpiringLicenses(today, futureDate)
                .stream()
                .map(driverMapper::toDto)
                .collect(Collectors.toList());
    }

    private Driver getDriverEntity(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver", "id", id));
    }
}
