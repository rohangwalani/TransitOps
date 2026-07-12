package com.transitops.repository;

import com.transitops.entity.Trip;
import com.transitops.enums.TripStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByStatus(TripStatus status);

    List<Trip> findByVehicleId(Long vehicleId);

    List<Trip> findByDriverId(Long driverId);

    long countByStatus(TripStatus status);

    @Query("SELECT t FROM Trip t WHERE " +
           "(:search IS NULL OR LOWER(t.source) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.destination) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR t.status = :status)")
    Page<Trip> searchTrips(
            @Param("search") String search,
            @Param("status") TripStatus status,
            Pageable pageable);

    @Query("SELECT SUM(t.fuelConsumed) FROM Trip t WHERE t.status = 'COMPLETED'")
    Double sumTotalFuelConsumed();

    @Query("SELECT SUM(t.actualDistance) FROM Trip t WHERE t.status = 'COMPLETED'")
    Double sumTotalDistanceCovered();

    @Query("SELECT t FROM Trip t WHERE t.startTime >= :from AND t.startTime <= :to")
    List<Trip> findTripsBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
