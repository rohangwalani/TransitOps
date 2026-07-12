package com.transitops.service;

import com.transitops.dto.request.VehicleRequestDTO;
import com.transitops.dto.response.VehicleResponseDTO;
import com.transitops.enums.VehicleStatus;
import com.transitops.enums.VehicleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VehicleService {

    VehicleResponseDTO createVehicle(VehicleRequestDTO dto);

    VehicleResponseDTO updateVehicle(Long id, VehicleRequestDTO dto);

    VehicleResponseDTO getVehicleById(Long id);

    List<VehicleResponseDTO> getAllVehicles();

    Page<VehicleResponseDTO> searchVehicles(String search, VehicleStatus status, VehicleType type, Pageable pageable);

    void deleteVehicle(Long id);

    VehicleResponseDTO updateVehicleStatus(Long id, VehicleStatus status);
}
