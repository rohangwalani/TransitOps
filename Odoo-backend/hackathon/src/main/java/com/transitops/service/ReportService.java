package com.transitops.service;

import com.transitops.dto.response.VehicleResponseDTO;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.util.List;

@Service
public class ReportService {

    private final VehicleService vehicleService;

    public ReportService(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    public ByteArrayInputStream generateFleetReportCsv() {
        List<VehicleResponseDTO> vehicles = vehicleService.getAllVehicles();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             PrintWriter pw = new PrintWriter(out)) {

            // CSV Header
            pw.println("Vehicle ID,Name,Registration Number,Type,Status,Max Load Capacity");

            // CSV Data
            for (VehicleResponseDTO v : vehicles) {
                pw.printf("%d,%s,%s,%s,%s,%.2f\n",
                        v.getId(),
                        v.getName() != null ? v.getName() : "",
                        v.getRegistrationNumber() != null ? v.getRegistrationNumber() : "",
                        v.getType() != null ? v.getType().name() : "",
                        v.getStatus() != null ? v.getStatus().name() : "",
                        v.getMaxLoadCapacity() != null ? v.getMaxLoadCapacity() : 0.0);
            }
            pw.flush();
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to export data to CSV file: " + e.getMessage());
        }
    }
}
