package com.transitops.controller;

import com.transitops.dto.request.VehicleRequestDTO;
import com.transitops.dto.response.MessageResponse;
import com.transitops.dto.response.VehicleResponseDTO;
import com.transitops.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<VehicleResponseDTO> createVehicle(@Valid @RequestBody VehicleRequestDTO requestDTO) {
        VehicleResponseDTO createdVehicle = vehicleService.createVehicle(requestDTO);
        return new ResponseEntity<>(createdVehicle, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN') or hasRole('DRIVER')")
    public ResponseEntity<Page<VehicleResponseDTO>> getAllVehicles(Pageable pageable) {
        Page<VehicleResponseDTO> vehicles = vehicleService.getAllVehicles(pageable);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN') or hasRole('DRIVER')")
    public ResponseEntity<VehicleResponseDTO> getVehicleById(@PathVariable Long id) {
        VehicleResponseDTO vehicle = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(vehicle);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<VehicleResponseDTO> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleRequestDTO requestDTO) {
        VehicleResponseDTO updatedVehicle = vehicleService.updateVehicle(id, requestDTO);
        return ResponseEntity.ok(updatedVehicle);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FLEET_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(new MessageResponse("Vehicle successfully retired/deleted"));
    }
}
