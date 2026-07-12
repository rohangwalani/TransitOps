package com.transitops.mapper;

import com.transitops.dto.request.VehicleRequestDTO;
import com.transitops.dto.response.VehicleResponseDTO;
import com.transitops.entity.Vehicle;
import com.transitops.enums.VehicleStatus;
import org.springframework.stereotype.Component;
@Component
public class VehicleMapper {

    public Vehicle toEntity(VehicleRequestDTO dto) {
        Vehicle vehicle = new Vehicle();
        vehicle.setName(dto.getName());
        vehicle.setRegistrationNumber(dto.getRegistrationNumber());
        vehicle.setModel(dto.getModel());
        vehicle.setMake(dto.getMake());
        vehicle.setYear(dto.getYear());
        vehicle.setType(dto.getType());
        vehicle.setMaxLoadCapacity(dto.getMaxLoadCapacity());
        vehicle.setOdometerReading(dto.getOdometerReading() != null ? dto.getOdometerReading() : 0.0);
        vehicle.setAcquisitionCost(dto.getAcquisitionCost());
        vehicle.setStatus(dto.getStatus() != null ? dto.getStatus() : VehicleStatus.AVAILABLE);
        vehicle.setLatitude(dto.getLatitude());
        vehicle.setLongitude(dto.getLongitude());
        vehicle.setNotes(dto.getNotes());
        return vehicle;
    }

    public void updateEntity(Vehicle vehicle, VehicleRequestDTO dto) {
        vehicle.setName(dto.getName());
        vehicle.setRegistrationNumber(dto.getRegistrationNumber());
        vehicle.setModel(dto.getModel());
        vehicle.setMake(dto.getMake());
        vehicle.setYear(dto.getYear());
        vehicle.setType(dto.getType());
        vehicle.setMaxLoadCapacity(dto.getMaxLoadCapacity());
        if (dto.getOdometerReading() != null) {
            vehicle.setOdometerReading(dto.getOdometerReading());
        }
        vehicle.setAcquisitionCost(dto.getAcquisitionCost());
        if (dto.getStatus() != null) {
            vehicle.setStatus(dto.getStatus());
        }
        vehicle.setLatitude(dto.getLatitude());
        vehicle.setLongitude(dto.getLongitude());
        vehicle.setNotes(dto.getNotes());
    }

    public VehicleResponseDTO toDto(Vehicle vehicle) {
        return VehicleResponseDTO.builder()
                .id(vehicle.getId())
                .name(vehicle.getName())
                .registrationNumber(vehicle.getRegistrationNumber())
                .model(vehicle.getModel())
                .make(vehicle.getMake())
                .year(vehicle.getYear())
                .type(vehicle.getType())
                .status(vehicle.getStatus())
                .maxLoadCapacity(vehicle.getMaxLoadCapacity())
                .odometerReading(vehicle.getOdometerReading())
                .acquisitionCost(vehicle.getAcquisitionCost())
                .latitude(vehicle.getLatitude())
                .longitude(vehicle.getLongitude())
                .notes(vehicle.getNotes())
                .createdAt(vehicle.getCreatedAt())
                .updatedAt(vehicle.getUpdatedAt())
                .build();
    }
}
