package com.transitops.repository;

import com.transitops.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.transitops.enums.TripStatus;

public interface TripRepository extends JpaRepository<Trip, Long> {
    Optional<Trip> findByTripCode(String tripCode);
    long countByStatus(TripStatus status);
}
