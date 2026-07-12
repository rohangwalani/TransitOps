package com.transitops.service.impl;

import com.transitops.dto.response.FleetMapResponseDTO;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.enums.TripStatus;
import com.transitops.enums.VehicleStatus;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.MapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class MapServiceImpl implements MapService {

    private static final Logger log = LoggerFactory.getLogger(MapServiceImpl.class);

    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;

    public MapServiceImpl(VehicleRepository vehicleRepository, TripRepository tripRepository) {
        this.vehicleRepository = vehicleRepository;
        this.tripRepository = tripRepository;
    }

    @Override
    public FleetMapResponseDTO getFleetMapData() {
        log.info("Fetching fleet map data");

        // All vehicles with coordinates
        List<FleetMapResponseDTO.VehicleMarker> vehicleMarkers = vehicleRepository.findAll()
                .stream()
                .filter(v -> v.getLatitude() != null && v.getLongitude() != null)
                .map(this::toVehicleMarker)
                .collect(Collectors.toList());

        // Active trip routes
        List<FleetMapResponseDTO.TripRoute> activeRoutes = tripRepository.findByStatus(TripStatus.DISPATCHED)
                .stream()
                .filter(t -> t.getSourceLat() != null && t.getDestLat() != null)
                .map(this::toTripRoute)
                .collect(Collectors.toList());

        return FleetMapResponseDTO.builder()
                .vehicleMarkers(vehicleMarkers)
                .activeRoutes(activeRoutes)
                .build();
    }

    private FleetMapResponseDTO.VehicleMarker toVehicleMarker(Vehicle vehicle) {
        // Find active trip for this vehicle if ON_TRIP
        String driverName = null;
        String destination = null;
        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            List<Trip> activeTrips = tripRepository.findByVehicleId(vehicle.getId())
                    .stream()
                    .filter(t -> t.getStatus() == TripStatus.DISPATCHED)
                    .collect(Collectors.toList());
            if (!activeTrips.isEmpty()) {
                Trip trip = activeTrips.get(0);
                driverName = trip.getDriver().getName();
                destination = trip.getDestination();
            }
        }

        return FleetMapResponseDTO.VehicleMarker.builder()
                .vehicleId(vehicle.getId())
                .vehicleName(vehicle.getName())
                .registrationNumber(vehicle.getRegistrationNumber())
                .status(vehicle.getStatus().name())
                .latitude(vehicle.getLatitude())
                .longitude(vehicle.getLongitude())
                .driverName(driverName)
                .currentTripDestination(destination)
                .build();
    }

    private FleetMapResponseDTO.TripRoute toTripRoute(Trip trip) {
        return FleetMapResponseDTO.TripRoute.builder()
                .tripId(trip.getId())
                .source(trip.getSource())
                .destination(trip.getDestination())
                .sourceLat(trip.getSourceLat())
                .sourceLng(trip.getSourceLng())
                .destLat(trip.getDestLat())
                .destLng(trip.getDestLng())
                .vehicleName(trip.getVehicle().getName())
                .driverName(trip.getDriver().getName())
                .cargoWeight(trip.getCargoWeight())
                .build();
    }
}
