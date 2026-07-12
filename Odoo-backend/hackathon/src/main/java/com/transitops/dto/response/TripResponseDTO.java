package com.transitops.dto.response;

import com.transitops.enums.TripStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TripResponseDTO {
    private Long id;
    private String source;
    private String destination;
    private VehicleResponseDTO vehicle;
    private DriverResponseDTO driver;
    private Double cargoWeight;
    private Double plannedDistance;
    private Double actualDistance;
    private Double fuelConsumed;
    private LocalDateTime plannedDeparture;
    private LocalDateTime plannedArrival;
    private LocalDateTime dispatchTime;
    private LocalDateTime completionTime;
    private TripStatus status;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
