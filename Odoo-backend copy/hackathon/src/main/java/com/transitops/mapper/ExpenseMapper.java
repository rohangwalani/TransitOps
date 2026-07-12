package com.transitops.mapper;

import com.transitops.dto.request.ExpenseRequestDTO;
import com.transitops.dto.response.ExpenseResponseDTO;
import com.transitops.entity.Expense;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import org.springframework.stereotype.Component;

@Component
public class ExpenseMapper {

    public Expense toEntity(ExpenseRequestDTO dto, Vehicle vehicle, Trip trip) {
        Expense expense = new Expense();
        expense.setVehicle(vehicle);
        expense.setTrip(trip);
        expense.setCategory(dto.getCategory());
        expense.setAmount(dto.getAmount());
        expense.setDescription(dto.getDescription());
        expense.setDate(dto.getDate());
        expense.setVendor(dto.getVendor());
        expense.setReceiptNumber(dto.getReceiptNumber());
        expense.setNotes(dto.getNotes());
        return expense;
    }

    public ExpenseResponseDTO toDto(Expense expense) {
        return ExpenseResponseDTO.builder()
                .id(expense.getId())
                .vehicleId(expense.getVehicle() != null ? expense.getVehicle().getId() : null)
                .vehicleName(expense.getVehicle() != null ? expense.getVehicle().getName() : null)
                .tripId(expense.getTrip() != null ? expense.getTrip().getId() : null)
                .category(expense.getCategory())
                .amount(expense.getAmount())
                .description(expense.getDescription())
                .date(expense.getDate())
                .vendor(expense.getVendor())
                .receiptNumber(expense.getReceiptNumber())
                .notes(expense.getNotes())
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt())
                .build();
    }
}
