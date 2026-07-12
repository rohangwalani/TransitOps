package com.transitops.dto.response;

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
public class FuelLogResponseDTO {

    private Long id;
    private Long vehicleId;
    private String vehicleName;
    private String vehicleRegistration;
    private Long tripId;
    private Double volumeLiters;
    private Double pricePerLiter;
    private Double totalCost;
    private LocalDate date;
    private String fuelStation;
    private String location;
    private Double odometerReading;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
