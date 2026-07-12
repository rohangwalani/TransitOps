package com.transitops.service;

import com.transitops.dto.request.TripCompleteRequestDTO;
import com.transitops.dto.request.TripRequestDTO;
import com.transitops.dto.response.TripResponseDTO;
import com.transitops.enums.TripStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TripService {

    TripResponseDTO createTrip(TripRequestDTO dto);

    TripResponseDTO dispatchTrip(Long id);

    TripResponseDTO completeTrip(Long id, TripCompleteRequestDTO dto);

    TripResponseDTO cancelTrip(Long id, String reason);

    TripResponseDTO getTripById(Long id);

    List<TripResponseDTO> getAllTrips();

    Page<TripResponseDTO> searchTrips(String search, TripStatus status, Pageable pageable);

    List<TripResponseDTO> getTripsByVehicle(Long vehicleId);

    List<TripResponseDTO> getTripsByDriver(Long driverId);
}
