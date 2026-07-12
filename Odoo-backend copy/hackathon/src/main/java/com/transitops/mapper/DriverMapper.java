package com.transitops.mapper;

import com.transitops.dto.request.DriverRequestDTO;
import com.transitops.dto.response.DriverResponseDTO;
import com.transitops.entity.Driver;
import com.transitops.enums.DriverStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DriverMapper {

    public Driver toEntity(DriverRequestDTO dto) {
        Driver driver = new Driver();
        driver.setName(dto.getName());
        driver.setLicenseNumber(dto.getLicenseNumber());
        driver.setLicenseCategory(dto.getLicenseCategory());
        driver.setLicenseExpiryDate(dto.getLicenseExpiryDate());
        driver.setContactNumber(dto.getContactNumber());
        driver.setEmail(dto.getEmail());
        driver.setStatus(dto.getStatus() != null ? dto.getStatus() : DriverStatus.AVAILABLE);
        driver.setSafetyScore(dto.getSafetyScore() != null ? dto.getSafetyScore() : 100);
        driver.setLatitude(dto.getLatitude());
        driver.setLongitude(dto.getLongitude());
        driver.setNotes(dto.getNotes());
        return driver;
    }

    public void updateEntity(Driver driver, DriverRequestDTO dto) {
        driver.setName(dto.getName());
        driver.setLicenseNumber(dto.getLicenseNumber());
        driver.setLicenseCategory(dto.getLicenseCategory());
        driver.setLicenseExpiryDate(dto.getLicenseExpiryDate());
        driver.setContactNumber(dto.getContactNumber());
        driver.setEmail(dto.getEmail());
        if (dto.getStatus() != null) {
            driver.setStatus(dto.getStatus());
        }
        if (dto.getSafetyScore() != null) {
            driver.setSafetyScore(dto.getSafetyScore());
        }
        driver.setLatitude(dto.getLatitude());
        driver.setLongitude(dto.getLongitude());
        driver.setNotes(dto.getNotes());
    }

    public DriverResponseDTO toDto(Driver driver) {
        LocalDate today = LocalDate.now();
        boolean licenseExpired = driver.getLicenseExpiryDate().isBefore(today);
        boolean licenseExpiringSoon = !licenseExpired &&
                driver.getLicenseExpiryDate().isBefore(today.plusDays(30));

        return DriverResponseDTO.builder()
                .id(driver.getId())
                .name(driver.getName())
                .licenseNumber(driver.getLicenseNumber())
                .licenseCategory(driver.getLicenseCategory())
                .licenseExpiryDate(driver.getLicenseExpiryDate())
                .licenseExpired(licenseExpired)
                .licenseExpiringSoon(licenseExpiringSoon)
                .contactNumber(driver.getContactNumber())
                .email(driver.getEmail())
                .status(driver.getStatus())
                .safetyScore(driver.getSafetyScore())
                .totalTrips(driver.getTotalTrips())
                .latitude(driver.getLatitude())
                .longitude(driver.getLongitude())
                .notes(driver.getNotes())
                .createdAt(driver.getCreatedAt())
                .updatedAt(driver.getUpdatedAt())
                .build();
    }
}
