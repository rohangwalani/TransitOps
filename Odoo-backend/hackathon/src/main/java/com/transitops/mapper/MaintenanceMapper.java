package com.transitops.mapper;

import com.transitops.dto.request.MaintenanceRequestDTO;
import com.transitops.dto.response.MaintenanceResponseDTO;
import com.transitops.entity.Maintenance;
import com.transitops.entity.Vehicle;
import com.transitops.enums.MaintenanceStatus;
import org.springframework.stereotype.Component;

@Component
public class MaintenanceMapper {

    public Maintenance toEntity(MaintenanceRequestDTO dto, Vehicle vehicle) {
        Maintenance m = new Maintenance();
        m.setVehicle(vehicle);
        m.setMaintenanceType(dto.getMaintenanceType());
        m.setDescription(dto.getDescription());
        m.setEstimatedCost(dto.getEstimatedCost());
        m.setActualCost(dto.getActualCost());
        m.setScheduledDate(dto.getScheduledDate());
        m.setCompletedDate(dto.getCompletedDate());
        m.setStatus(dto.getStatus() != null ? dto.getStatus() : MaintenanceStatus.SCHEDULED);
        m.setTechnicianName(dto.getTechnicianName());
        m.setWorkshopName(dto.getWorkshopName());
        m.setNotes(dto.getNotes());
        return m;
    }

    public void updateEntity(Maintenance m, MaintenanceRequestDTO dto, Vehicle vehicle) {
        m.setVehicle(vehicle);
        m.setMaintenanceType(dto.getMaintenanceType());
        m.setDescription(dto.getDescription());
        m.setEstimatedCost(dto.getEstimatedCost());
        m.setActualCost(dto.getActualCost());
        m.setScheduledDate(dto.getScheduledDate());
        m.setCompletedDate(dto.getCompletedDate());
        if (dto.getStatus() != null) {
            m.setStatus(dto.getStatus());
        }
        m.setTechnicianName(dto.getTechnicianName());
        m.setWorkshopName(dto.getWorkshopName());
        m.setNotes(dto.getNotes());
    }

    public MaintenanceResponseDTO toDto(Maintenance m) {
        return MaintenanceResponseDTO.builder()
                .id(m.getId())
                .vehicleId(m.getVehicle().getId())
                .vehicleName(m.getVehicle().getName())
                .vehicleRegistration(m.getVehicle().getRegistrationNumber())
                .maintenanceType(m.getMaintenanceType())
                .description(m.getDescription())
                .estimatedCost(m.getEstimatedCost())
                .actualCost(m.getActualCost())
                .scheduledDate(m.getScheduledDate())
                .completedDate(m.getCompletedDate())
                .status(m.getStatus())
                .technicianName(m.getTechnicianName())
                .workshopName(m.getWorkshopName())
                .notes(m.getNotes())
                .createdAt(m.getCreatedAt())
                .updatedAt(m.getUpdatedAt())
                .build();
    }
}
