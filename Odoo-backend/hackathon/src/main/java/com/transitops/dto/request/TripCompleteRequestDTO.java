package com.transitops.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TripCompleteRequestDTO {
    @NotNull(message = "Actual distance is required")
    @Min(value = 0, message = "Actual distance cannot be negative")
    private Double actualDistance;

    @NotNull(message = "Fuel consumed is required")
    @Min(value = 0, message = "Fuel consumed cannot be negative")
    private Double fuelConsumed;

    @NotNull(message = "Final odometer reading is required")
    @Min(value = 0, message = "Final odometer reading cannot be negative")
    private Double finalOdometer;

    private String remarks;
}
