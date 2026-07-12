package com.transitops.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FuelLogRequestDTO {

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    private Long tripId;

    @NotNull(message = "Volume is required")
    @Positive(message = "Volume must be positive")
    private Double volumeLiters;

    @NotNull(message = "Price per liter is required")
    @Positive(message = "Price per liter must be positive")
    private Double pricePerLiter;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private String fuelStation;

    private String location;

    private Double odometerReading;

    private String notes;
}
