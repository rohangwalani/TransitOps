package com.transitops.controller;

import com.transitops.dto.DashboardDTO;
import com.transitops.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasRole('FLEET_MANAGER')")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<?> getDashboard() {
        DashboardDTO stats = dashboardService.getDashboardStats();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Dashboard statistics retrieved successfully");
        response.put("data", stats);
        
        return ResponseEntity.ok(response);
    }
}
