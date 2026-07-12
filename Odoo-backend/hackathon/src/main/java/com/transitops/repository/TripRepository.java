package com.transitops.repository;

import com.transitops.entity.Trip;
import com.transitops.enums.TripStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    Page<Trip> findByStatus(TripStatus status, Pageable pageable);
    Page<Trip> findByDriverId(Long driverId, Pageable pageable);
    Page<Trip> findByVehicleId(Long vehicleId, Pageable pageable);
}
