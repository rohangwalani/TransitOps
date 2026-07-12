package com.transitops.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TripRequestDTO {
    @NotBlank(message = "Source location is required")
    private String source;

    @NotBlank(message = "Destination location is required")
    private String destination;

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Driver ID is required")
    private Long driverId;

    @NotNull(message = "Cargo weight is required")
    @Min(value = 1, message = "Cargo weight must be positive")
    private Double cargoWeight;

    @NotNull(message = "Planned distance is required")
    @Min(value = 1, message = "Planned distance must be positive")
    private Double plannedDistance;

    @Future(message = "Planned departure must be in the future")
    private LocalDateTime plannedDeparture;

    @Future(message = "Planned arrival must be in the future")
    private LocalDateTime plannedArrival;

    private String remarks;
}
