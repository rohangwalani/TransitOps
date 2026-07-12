package com.transitops.controller;

import com.transitops.dto.request.TripCompleteRequestDTO;
import com.transitops.dto.request.TripRequestDTO;
import com.transitops.dto.response.MessageResponse;
import com.transitops.dto.response.TripResponseDTO;
import com.transitops.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TripResponseDTO> createTrip(@Valid @RequestBody TripRequestDTO requestDTO) {
        TripResponseDTO trip = tripService.createTrip(requestDTO);
        return new ResponseEntity<>(trip, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN') or hasRole('DRIVER')")
    public ResponseEntity<Page<TripResponseDTO>> getAllTrips(Pageable pageable) {
        return ResponseEntity.ok(tripService.getAllTrips(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN') or hasRole('DRIVER')")
    public ResponseEntity<TripResponseDTO> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TripResponseDTO> updateTrip(@PathVariable Long id, @Valid @RequestBody TripRequestDTO requestDTO) {
        return ResponseEntity.ok(tripService.updateTrip(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.ok(new MessageResponse("Trip successfully deleted"));
    }

    @PostMapping("/{id}/dispatch")
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TripResponseDTO> dispatchTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.dispatchTrip(id));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN') or hasRole('DRIVER')")
    public ResponseEntity<TripResponseDTO> completeTrip(@PathVariable Long id, @Valid @RequestBody TripCompleteRequestDTO requestDTO) {
        return ResponseEntity.ok(tripService.completeTrip(id, requestDTO));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TripResponseDTO> cancelTrip(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.cancelTrip(id));
    }
}
