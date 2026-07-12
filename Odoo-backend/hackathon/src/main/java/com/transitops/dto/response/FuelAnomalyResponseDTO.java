package com.transitops.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FuelAnomalyResponseDTO {
    private Long vehicleId;
    private String vehicleNumber;
    private Double historicalEfficiency;
    private Double currentEfficiency;
    private Double deviation;
    private String status;
    private String recommendation;
}
