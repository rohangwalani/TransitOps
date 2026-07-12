package com.transitops.entity;

import com.transitops.enums.DriverStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "drivers", uniqueConstraints = {
        @UniqueConstraint(columnNames = "licenseNumber")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    @Column(nullable = false)
    private String licenseCategory;

    @Column(nullable = false)
    private LocalDate licenseExpiryDate;

    @Column(nullable = false)
    private String contactNumber;

    @Column(nullable = false)
    @Builder.Default
    private Integer safetyScore = 100;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DriverStatus status = DriverStatus.AVAILABLE;
}
