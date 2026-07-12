package com.transitops.service;

import com.transitops.dto.request.DriverRequestDTO;
import com.transitops.dto.response.DriverResponseDTO;
import com.transitops.enums.DriverStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DriverService {

    DriverResponseDTO createDriver(DriverRequestDTO dto);

    DriverResponseDTO updateDriver(Long id, DriverRequestDTO dto);

    DriverResponseDTO getDriverById(Long id);

    List<DriverResponseDTO> getAllDrivers();

    Page<DriverResponseDTO> searchDrivers(String search, DriverStatus status, Pageable pageable);

    void deleteDriver(Long id);

    DriverResponseDTO updateDriverStatus(Long id, DriverStatus status);

    List<DriverResponseDTO> getDriversWithExpiringLicenses(int daysAhead);
}
