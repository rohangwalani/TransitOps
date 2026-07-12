package com.transitops.repository;

import com.transitops.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.transitops.enums.DriverStatus;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    boolean existsByLicenseNumber(String licenseNumber);
    long countByStatus(DriverStatus status);
}
