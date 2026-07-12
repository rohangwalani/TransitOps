package com.transitops.dto.request;

import com.transitops.enums.DriverStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DriverRequestDTO {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "License Number is required")
    private String licenseNumber;

    @NotBlank(message = "License Category is required")
    private String licenseCategory;

    @NotNull(message = "License Expiry Date is required")
    @Future(message = "License Expiry Date must be in the future")
    private LocalDate licenseExpiryDate;

    @NotBlank(message = "Contact Number is required")
    private String contactNumber;

    @Min(value = 0, message = "Safety score cannot be less than 0")
    @Max(value = 100, message = "Safety score cannot be more than 100")
    private Integer safetyScore;

    private DriverStatus status;
}
