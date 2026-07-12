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
public class ExpenseResponseDTO {

    private Long id;
    private Long vehicleId;
    private String vehicleName;
    private Long tripId;
    private String category;
    private Double amount;
    private String description;
    private LocalDate date;
    private String vendor;
    private String receiptNumber;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
