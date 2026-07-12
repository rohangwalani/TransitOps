package com.transitops.repository;

import com.transitops.entity.Maintenance;
import com.transitops.enums.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

    List<Maintenance> findByVehicleId(Long vehicleId);

    List<Maintenance> findByStatus(MaintenanceStatus status);

    long countByStatus(MaintenanceStatus status);

    @Query("SELECT m FROM Maintenance m WHERE m.scheduledDate BETWEEN :today AND :futureDate")
    List<Maintenance> findUpcomingMaintenance(
            @Param("today") LocalDate today,
            @Param("futureDate") LocalDate futureDate);

    @Query("SELECT SUM(m.actualCost) FROM Maintenance m WHERE m.status = 'COMPLETED'")
    Double sumTotalMaintenanceCost();
}
