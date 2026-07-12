package com.transitops.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "fuel_expenses")
@Data
public class FuelExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private Double fuelCost = 0.0;

    @Column(nullable = false)
    private Double tollCost = 0.0;

    @Column(nullable = false)
    private Double maintenanceCost = 0.0; // on-trip maintenance/fixes

    @Column(nullable = false)
    private Double totalExpense = 0.0;

    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void calculateTotal() {
        this.totalExpense = this.fuelCost + this.tollCost + this.maintenanceCost;
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    public void onPersist() {
        this.totalExpense = this.fuelCost + this.tollCost + this.maintenanceCost;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
