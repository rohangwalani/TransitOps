package com.transitops.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TripRequestDTO {

    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Driver ID is required")
    private Long driverId;

    @NotNull(message = "Cargo weight is required")
    @Positive(message = "Cargo weight must be positive")
    private Double cargoWeight;

    private Double plannedDistance;

    private LocalDateTime estimatedArrival;

    private String remarks;

    // Optional source/destination coordinate hints
    private Double sourceLat;
    private Double sourceLng;
    private Double destLat;
    private Double destLng;
}
