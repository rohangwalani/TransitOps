package com.transitops.controller;

import com.transitops.entity.Trip;
import com.transitops.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
@PreAuthorize("hasAnyRole('FLEET_MANAGER', 'DISPATCHER')")
@CrossOrigin(origins = "*")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public ResponseEntity<?> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @PostMapping
    public ResponseEntity<?> createTrip(@RequestBody Trip trip) {
        Trip saved = tripService.createTrip(trip);
        return buildSuccessResponse("Trip DRAFT created successfully", saved);
    }

    @PostMapping("/{id}/dispatch")
    public ResponseEntity<?> dispatchTrip(@PathVariable Long id) {
        Trip dispatched = tripService.dispatchTrip(id);
        return buildSuccessResponse("Trip DISPATCHED successfully! Driver and Vehicle statuses are now ON_TRIP", dispatched);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeTrip(@PathVariable Long id, @RequestBody(required = false) Map<String, Double> payload) {
        Double actualDistance = payload != null ? payload.get("actualDistance") : null;
        Trip completed = tripService.completeTrip(id, actualDistance);
        return buildSuccessResponse("Trip COMPLETED successfully! Driver and Vehicle are now AVAILABLE", completed);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelTrip(@PathVariable Long id) {
        Trip cancelled = tripService.cancelTrip(id);
        return buildSuccessResponse("Trip CANCELLED successfully", cancelled);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return buildSuccessResponse("Trip deleted successfully", null);
    }

    private ResponseEntity<?> buildSuccessResponse(String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        if (data != null) {
            response.put("data", data);
        }
        return ResponseEntity.ok(response);
    }
}
