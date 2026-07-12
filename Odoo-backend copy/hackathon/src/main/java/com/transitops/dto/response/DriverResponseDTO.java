package com.transitops.dto.response;

import com.transitops.enums.DriverStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverResponseDTO {

    private Long id;
    private String name;
    private String licenseNumber;
    private String licenseCategory;
    private LocalDate licenseExpiryDate;
    private boolean licenseExpired;
    private boolean licenseExpiringSoon; // within 30 days
    private String contactNumber;
    private String email;
    private DriverStatus status;
    private Integer safetyScore;
    private Integer totalTrips;
    private Double latitude;
    private Double longitude;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
