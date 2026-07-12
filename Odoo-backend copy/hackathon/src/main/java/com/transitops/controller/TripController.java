package com.transitops.controller;

import com.transitops.dto.request.TripCompleteRequestDTO;
import com.transitops.dto.request.TripRequestDTO;
import com.transitops.dto.response.TripResponseDTO;
import com.transitops.enums.TripStatus;
import com.transitops.service.TripService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@Tag(name = "Trips", description = "Trip Management and Dispatch APIs")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    @Operation(summary = "Create a new trip (DRAFT)")
    public ResponseEntity<TripResponseDTO> createTrip(@Valid @RequestBody TripRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tripService.createTrip(dto));
    }

    @PostMapping("/{id}/dispatch")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    @Operation(summary = "Dispatch a DRAFT trip")
    public ResponseEntity<TripResponseDTO> dispatchTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.dispatchTrip(id));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DRIVER')")
    @Operation(summary = "Complete a dispatched trip")
    public ResponseEntity<TripResponseDTO> completeTrip(@PathVariable Long id,
                                                         @Valid @RequestBody TripCompleteRequestDTO dto) {
        return ResponseEntity.ok(tripService.completeTrip(id, dto));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    @Operation(summary = "Cancel a trip")
    public ResponseEntity<TripResponseDTO> cancelTrip(@PathVariable Long id,
                                                       @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(tripService.cancelTrip(id, reason));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get trip by ID")
    public ResponseEntity<TripResponseDTO> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @GetMapping
    @Operation(summary = "Get all trips")
    public ResponseEntity<List<TripResponseDTO>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/search")
    @Operation(summary = "Search and filter trips with pagination")
    public ResponseEntity<Page<TripResponseDTO>> searchTrips(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TripStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(tripService.searchTrips(search, status, pageable));
    }

    @GetMapping("/vehicle/{vehicleId}")
    @Operation(summary = "Get all trips for a specific vehicle")
    public ResponseEntity<List<TripResponseDTO>> getTripsByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(tripService.getTripsByVehicle(vehicleId));
    }

    @GetMapping("/driver/{driverId}")
    @Operation(summary = "Get all trips for a specific driver")
    public ResponseEntity<List<TripResponseDTO>> getTripsByDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(tripService.getTripsByDriver(driverId));
    }
}
