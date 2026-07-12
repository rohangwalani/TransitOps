package com.transitops.service;

import com.transitops.dto.request.FuelLogRequestDTO;
import com.transitops.dto.response.FuelLogResponseDTO;

import java.util.List;

public interface FuelService {

    FuelLogResponseDTO addFuelLog(FuelLogRequestDTO dto);

    FuelLogResponseDTO updateFuelLog(Long id, FuelLogRequestDTO dto);

    FuelLogResponseDTO getFuelLogById(Long id);

    List<FuelLogResponseDTO> getAllFuelLogs();

    List<FuelLogResponseDTO> getFuelLogsByVehicle(Long vehicleId);

    void deleteFuelLog(Long id);
}
