package com.transitops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FleetMapResponseDTO {

    private List<VehicleMarker> vehicleMarkers;
    private List<TripRoute> activeRoutes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VehicleMarker {
        private Long vehicleId;
        private String vehicleName;
        private String registrationNumber;
        private String status;
        private Double latitude;
        private Double longitude;
        private String driverName;
        private String currentTripDestination;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TripRoute {
        private Long tripId;
        private String source;
        private String destination;
        private Double sourceLat;
        private Double sourceLng;
        private Double destLat;
        private Double destLng;
        private String vehicleName;
        private String driverName;
        private Double cargoWeight;
    }
}
