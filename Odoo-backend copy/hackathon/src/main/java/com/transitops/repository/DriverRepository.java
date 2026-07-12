package com.transitops.repository;

import com.transitops.entity.Driver;
import com.transitops.enums.DriverStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    Optional<Driver> findByLicenseNumber(String licenseNumber);

    Boolean existsByLicenseNumber(String licenseNumber);

    List<Driver> findByStatus(DriverStatus status);

    long countByStatus(DriverStatus status);

    // Find drivers with licenses expiring within N days
    @Query("SELECT d FROM Driver d WHERE d.licenseExpiryDate BETWEEN :today AND :futureDate")
    List<Driver> findDriversWithExpiringLicenses(
            @Param("today") LocalDate today,
            @Param("futureDate") LocalDate futureDate);

    // Find drivers with expired licenses
    @Query("SELECT d FROM Driver d WHERE d.licenseExpiryDate < :today")
    List<Driver> findDriversWithExpiredLicenses(@Param("today") LocalDate today);

    @Query("SELECT d FROM Driver d WHERE " +
           "(:search IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.licenseNumber) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR d.status = :status)")
    Page<Driver> searchDrivers(
            @Param("search") String search,
            @Param("status") DriverStatus status,
            Pageable pageable);
}
