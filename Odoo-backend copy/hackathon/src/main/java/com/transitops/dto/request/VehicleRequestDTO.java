package com.transitops.dto.request;

import com.transitops.enums.VehicleStatus;
import com.transitops.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class VehicleRequestDTO {

    @NotBlank(message = "Vehicle name is required")
    private String name;

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    private String model;

    private String make;

    private Integer year;

    @NotNull(message = "Vehicle type is required")
    private VehicleType type;

    @NotNull(message = "Max load capacity is required")
    @Positive(message = "Max load capacity must be positive")
    private Double maxLoadCapacity;

    private Double odometerReading;

    private Double acquisitionCost;

    private VehicleStatus status;

    private Double latitude;

    private Double longitude;

    private String notes;
}
