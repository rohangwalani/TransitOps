package com.transitops.dto.response;

import com.transitops.enums.VehicleStatus;
import com.transitops.enums.VehicleType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VehicleResponseDTO {
    private Long id;
    private String registrationNumber;
    private String name;
    private String model;
    private VehicleType type;
    private Double maxLoadCapacity;
    private Double odometerReading;
    private BigDecimal acquisitionCost;
    private VehicleStatus status;
}
