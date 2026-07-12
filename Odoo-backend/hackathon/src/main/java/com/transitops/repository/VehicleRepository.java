package com.transitops.repository;

import com.transitops.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.transitops.enums.VehicleStatus;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    boolean existsByRegistrationNumber(String registrationNumber);
    long countByStatus(VehicleStatus status);
}
