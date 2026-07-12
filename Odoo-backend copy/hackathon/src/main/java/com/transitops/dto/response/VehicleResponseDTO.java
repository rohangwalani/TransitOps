package com.transitops.dto.response;

import com.transitops.enums.VehicleStatus;
import com.transitops.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponseDTO {

    private Long id;
    private String name;
    private String registrationNumber;
    private String model;
    private String make;
    private Integer year;
    private VehicleType type;
    private VehicleStatus status;
    private Double maxLoadCapacity;
    private Double odometerReading;
    private Double acquisitionCost;
    private Double latitude;
    private Double longitude;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
