package com.transitops.service;

import com.transitops.dto.request.DriverRequestDTO;
import com.transitops.dto.response.DriverResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DriverService {
    DriverResponseDTO createDriver(DriverRequestDTO requestDTO);
    DriverResponseDTO updateDriver(Long id, DriverRequestDTO requestDTO);
    void deleteDriver(Long id);
    DriverResponseDTO getDriverById(Long id);
    Page<DriverResponseDTO> getAllDrivers(Pageable pageable);
}
