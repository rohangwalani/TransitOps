package com.transitops.service;

import com.transitops.entity.Driver;
import com.transitops.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
    }

    public Driver createDriver(Driver driver) {
        if (driverRepository.existsByLicenseNumber(driver.getLicenseNumber())) {
            throw new IllegalArgumentException("License number must be unique");
        }
        if (driver.getLicenseExpiry().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("License expiry cannot be in the past");
        }
        return driverRepository.save(driver);
    }

    public Driver updateDriver(Long id, Driver updatedDriver) {
        Driver driver = getDriverById(id);
        
        if (!driver.getLicenseNumber().equals(updatedDriver.getLicenseNumber()) && 
            driverRepository.existsByLicenseNumber(updatedDriver.getLicenseNumber())) {
            throw new IllegalArgumentException("License number must be unique");
        }
        if (updatedDriver.getLicenseExpiry().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("License expiry cannot be in the past");
        }

        driver.setName(updatedDriver.getName());
        driver.setPhone(updatedDriver.getPhone());
        driver.setLicenseNumber(updatedDriver.getLicenseNumber());
        driver.setLicenseExpiry(updatedDriver.getLicenseExpiry());
        driver.setSafetyScore(updatedDriver.getSafetyScore());
        driver.setStatus(updatedDriver.getStatus());

        return driverRepository.save(driver);
    }

    public void deleteDriver(Long id) {
        Driver driver = getDriverById(id);
        driverRepository.delete(driver);
    }
}
