package com.transitops.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PredictiveMaintenanceResponseDTO {
    private Long vehicleId;
    private String vehicleNumber;
    private Integer riskScore;
    private String riskLevel;
    private Double distanceSinceLastService;
    private Double fuelEfficiencyDrop;
    private String recommendation;
}
