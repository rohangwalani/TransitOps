package com.transitops.controller;

import com.transitops.dto.response.FleetMapResponseDTO;
import com.transitops.service.MapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/map")
@Tag(name = "Fleet Map", description = "Fleet Map coordinate APIs for Leaflet integration")
public class MapController {

    private final MapService mapService;

    public MapController(MapService mapService) {
        this.mapService = mapService;
    }

    @GetMapping("/fleet")
    @Operation(summary = "Get fleet map data with vehicle markers and active trip routes")
    public ResponseEntity<FleetMapResponseDTO> getFleetMapData() {
        return ResponseEntity.ok(mapService.getFleetMapData());
    }
}
