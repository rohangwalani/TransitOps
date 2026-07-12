package com.transitops.dto.response;

import com.transitops.enums.MaintenanceStatus;
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
public class MaintenanceResponseDTO {

    private Long id;
    private Long vehicleId;
    private String vehicleName;
    private String vehicleRegistration;
    private String maintenanceType;
    private String description;
    private Double estimatedCost;
    private Double actualCost;
    private LocalDate scheduledDate;
    private LocalDate completedDate;
    private MaintenanceStatus status;
    private String technicianName;
    private String workshopName;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
