package com.transitops.service;

import com.transitops.dto.request.TripCompleteRequestDTO;
import com.transitops.dto.request.TripRequestDTO;
import com.transitops.dto.response.TripResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TripService {
    TripResponseDTO createTrip(TripRequestDTO requestDTO);
    TripResponseDTO updateTrip(Long id, TripRequestDTO requestDTO);
    void deleteTrip(Long id);
    TripResponseDTO getTripById(Long id);
    Page<TripResponseDTO> getAllTrips(Pageable pageable);
    
    TripResponseDTO dispatchTrip(Long id);
    TripResponseDTO completeTrip(Long id, TripCompleteRequestDTO requestDTO);
    TripResponseDTO cancelTrip(Long id);
}
