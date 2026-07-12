package com.transitops.dto.response;

import com.transitops.enums.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripResponseDTO {

    private Long id;
    private String source;
    private String destination;
    private Long vehicleId;
    private String vehicleName;
    private String vehicleRegistration;
    private Long driverId;
    private String driverName;
    private Double cargoWeight;
    private Double plannedDistance;
    private Double actualDistance;
    private Double fuelConsumed;
    private TripStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime estimatedArrival;
    private String remarks;
    private Double sourceLat;
    private Double sourceLng;
    private Double destLat;
    private Double destLng;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
