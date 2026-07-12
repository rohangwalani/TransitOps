package com.transitops.mapper;

import com.transitops.dto.response.TripResponseDTO;
import com.transitops.entity.Trip;
import org.springframework.stereotype.Component;

@Component
public class TripMapper {

    public TripResponseDTO toDto(Trip trip) {
        return TripResponseDTO.builder()
                .id(trip.getId())
                .source(trip.getSource())
                .destination(trip.getDestination())
                .vehicleId(trip.getVehicle().getId())
                .vehicleName(trip.getVehicle().getName())
                .vehicleRegistration(trip.getVehicle().getRegistrationNumber())
                .driverId(trip.getDriver().getId())
                .driverName(trip.getDriver().getName())
                .cargoWeight(trip.getCargoWeight())
                .plannedDistance(trip.getPlannedDistance())
                .actualDistance(trip.getActualDistance())
                .fuelConsumed(trip.getFuelConsumed())
                .status(trip.getStatus())
                .startTime(trip.getStartTime())
                .endTime(trip.getEndTime())
                .estimatedArrival(trip.getEstimatedArrival())
                .remarks(trip.getRemarks())
                .sourceLat(trip.getSourceLat())
                .sourceLng(trip.getSourceLng())
                .destLat(trip.getDestLat())
                .destLng(trip.getDestLng())
                .createdAt(trip.getCreatedAt())
                .updatedAt(trip.getUpdatedAt())
                .build();
    }
}
