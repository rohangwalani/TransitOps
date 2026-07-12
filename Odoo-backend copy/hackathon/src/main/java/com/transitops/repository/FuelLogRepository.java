package com.transitops.repository;

import com.transitops.entity.FuelLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FuelLogRepository extends JpaRepository<FuelLog, Long> {

    List<FuelLog> findByVehicleId(Long vehicleId);

    List<FuelLog> findByTripId(Long tripId);

    @Query("SELECT SUM(f.totalCost) FROM FuelLog f")
    Double sumTotalFuelCost();

    @Query("SELECT SUM(f.volumeLiters) FROM FuelLog f")
    Double sumTotalFuelVolume();

    @Query("SELECT f FROM FuelLog f WHERE f.date BETWEEN :from AND :to")
    List<FuelLog> findFuelLogsBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT f FROM FuelLog f WHERE f.vehicle.id = :vehicleId ORDER BY f.date DESC")
    List<FuelLog> findRecentFuelLogsByVehicle(@Param("vehicleId") Long vehicleId);
}
