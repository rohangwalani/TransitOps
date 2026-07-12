package com.transitops.mapper;

import com.transitops.dto.request.FuelLogRequestDTO;
import com.transitops.dto.response.FuelLogResponseDTO;
import com.transitops.entity.FuelLog;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import org.springframework.stereotype.Component;

@Component
public class FuelLogMapper {

    public FuelLog toEntity(FuelLogRequestDTO dto, Vehicle vehicle, Trip trip) {
        FuelLog log = new FuelLog();
        log.setVehicle(vehicle);
        log.setTrip(trip);
        log.setVolumeLiters(dto.getVolumeLiters());
        log.setPricePerLiter(dto.getPricePerLiter());
        log.setTotalCost(dto.getVolumeLiters() * dto.getPricePerLiter());
        log.setDate(dto.getDate());
        log.setFuelStation(dto.getFuelStation());
        log.setLocation(dto.getLocation());
        log.setOdometerReading(dto.getOdometerReading());
        log.setNotes(dto.getNotes());
        return log;
    }

    public FuelLogResponseDTO toDto(FuelLog log) {
        return FuelLogResponseDTO.builder()
                .id(log.getId())
                .vehicleId(log.getVehicle().getId())
                .vehicleName(log.getVehicle().getName())
                .vehicleRegistration(log.getVehicle().getRegistrationNumber())
                .tripId(log.getTrip() != null ? log.getTrip().getId() : null)
                .volumeLiters(log.getVolumeLiters())
                .pricePerLiter(log.getPricePerLiter())
                .totalCost(log.getTotalCost())
                .date(log.getDate())
                .fuelStation(log.getFuelStation())
                .location(log.getLocation())
                .odometerReading(log.getOdometerReading())
                .notes(log.getNotes())
                .createdAt(log.getCreatedAt())
                .updatedAt(log.getUpdatedAt())
                .build();
    }
}
