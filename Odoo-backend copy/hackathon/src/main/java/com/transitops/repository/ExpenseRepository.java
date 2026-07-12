package com.transitops.repository;

import com.transitops.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByVehicleId(Long vehicleId);

    List<Expense> findByTripId(Long tripId);

    List<Expense> findByCategory(String category);

    @Query("SELECT SUM(e.amount) FROM Expense e")
    Double sumTotalExpenses();

    @Query("SELECT e FROM Expense e WHERE e.date BETWEEN :from AND :to")
    List<Expense> findExpensesBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e GROUP BY e.category")
    List<Object[]> sumExpensesByCategory();
}
