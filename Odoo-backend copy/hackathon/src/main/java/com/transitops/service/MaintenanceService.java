package com.transitops.service;

import com.transitops.dto.request.MaintenanceRequestDTO;
import com.transitops.dto.response.MaintenanceResponseDTO;
import com.transitops.enums.MaintenanceStatus;

import java.util.List;

public interface MaintenanceService {

    MaintenanceResponseDTO scheduleMaintenance(MaintenanceRequestDTO dto);

    MaintenanceResponseDTO updateMaintenance(Long id, MaintenanceRequestDTO dto);

    MaintenanceResponseDTO activateMaintenance(Long id);

    MaintenanceResponseDTO completeMaintenance(Long id, Double actualCost);

    MaintenanceResponseDTO getMaintenanceById(Long id);

    List<MaintenanceResponseDTO> getAllMaintenance();

    List<MaintenanceResponseDTO> getMaintenanceByVehicle(Long vehicleId);

    List<MaintenanceResponseDTO> getMaintenanceByStatus(MaintenanceStatus status);

    List<MaintenanceResponseDTO> getUpcomingMaintenance(int daysAhead);

    void deleteMaintenance(Long id);
}
