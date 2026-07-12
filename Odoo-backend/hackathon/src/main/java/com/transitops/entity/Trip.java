package com.transitops.entity;

import com.transitops.enums.TripStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String destination;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    // Cargo weight in kg - must not exceed vehicle maxLoadCapacity
    @Column(nullable = false)
    private Double cargoWeight;

    // Planned distance in km
    private Double plannedDistance;

    // Actual distance driven (set on completion)
    private Double actualDistance;

    // Fuel consumed in liters (set on completion)
    private Double fuelConsumed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TripStatus status = TripStatus.DRAFT;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private LocalDateTime estimatedArrival;

    private String remarks;

    // Source coordinates for map telemetry
    private Double sourceLat;
    private Double sourceLng;

    // Destination coordinates for map telemetry
    private Double destLat;
    private Double destLng;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
