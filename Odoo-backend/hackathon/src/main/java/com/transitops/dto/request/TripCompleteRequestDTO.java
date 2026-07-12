package com.transitops.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TripCompleteRequestDTO {

    @NotNull(message = "Actual distance is required")
    @Positive(message = "Actual distance must be positive")
    private Double actualDistance;

    @NotNull(message = "Fuel consumed is required")
    @Positive(message = "Fuel consumed must be positive")
    private Double fuelConsumed;

    private String remarks;
}
