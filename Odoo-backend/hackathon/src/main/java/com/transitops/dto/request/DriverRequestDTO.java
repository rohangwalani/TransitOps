package com.transitops.dto.request;

import com.transitops.enums.DriverStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DriverRequestDTO {

    @NotBlank(message = "Driver name is required")
    private String name;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    private String licenseCategory;

    @NotNull(message = "License expiry date is required")
    private LocalDate licenseExpiryDate;

    private String contactNumber;

    private String email;

    private DriverStatus status;

    private Integer safetyScore;

    private Double latitude;

    private Double longitude;

    private String notes;
}
