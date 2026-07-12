package com.transitops.dto.request;

import com.transitops.enums.VehicleStatus;
import com.transitops.enums.VehicleType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VehicleRequestDTO {
    @NotBlank(message = "Registration Number is required")
    private String registrationNumber;

    @NotBlank(message = "Vehicle Name is required")
    private String name;

    private String model;

    @NotNull(message = "Vehicle Type is required")
    private VehicleType type;

    @NotNull(message = "Maximum Load Capacity is required")
    @Min(value = 0, message = "Maximum Load Capacity cannot be negative")
    private Double maxLoadCapacity;

    @NotNull(message = "Odometer Reading is required")
    @Min(value = 0, message = "Odometer Reading cannot be negative")
    private Double odometerReading;

    @NotNull(message = "Acquisition Cost is required")
    @Min(value = 0, message = "Acquisition Cost cannot be negative")
    private BigDecimal acquisitionCost;

    private VehicleStatus status;
}
