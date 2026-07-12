package com.transitops.service;

import com.transitops.dto.request.VehicleRequestDTO;
import com.transitops.dto.response.VehicleResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VehicleService {
    VehicleResponseDTO createVehicle(VehicleRequestDTO requestDTO);
    VehicleResponseDTO updateVehicle(Long id, VehicleRequestDTO requestDTO);
    void deleteVehicle(Long id);
    VehicleResponseDTO getVehicleById(Long id);
    Page<VehicleResponseDTO> getAllVehicles(Pageable pageable);
}
