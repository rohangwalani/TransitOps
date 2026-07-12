package com.transitops.service.impl;

import com.transitops.dto.request.FuelLogRequestDTO;
import com.transitops.dto.response.FuelLogResponseDTO;
import com.transitops.entity.FuelLog;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.mapper.FuelLogMapper;
import com.transitops.repository.FuelLogRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.FuelService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FuelServiceImpl implements FuelService {

    private static final Logger log = LoggerFactory.getLogger(FuelServiceImpl.class);

    private final FuelLogRepository fuelLogRepository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;
    private final FuelLogMapper fuelLogMapper;

    public FuelServiceImpl(FuelLogRepository fuelLogRepository,
                           VehicleRepository vehicleRepository,
                           TripRepository tripRepository,
                           FuelLogMapper fuelLogMapper) {
        this.fuelLogRepository = fuelLogRepository;
        this.vehicleRepository = vehicleRepository;
        this.tripRepository = tripRepository;
        this.fuelLogMapper = fuelLogMapper;
    }

    @Override
    public FuelLogResponseDTO addFuelLog(FuelLogRequestDTO dto) {
        log.info("Adding fuel log for vehicle id: {}", dto.getVehicleId());
        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", dto.getVehicleId()));

        Trip trip = null;
        if (dto.getTripId() != null) {
            trip = tripRepository.findById(dto.getTripId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", dto.getTripId()));
        }

        FuelLog fuelLog = fuelLogMapper.toEntity(dto, vehicle, trip);
        FuelLog saved = fuelLogRepository.save(fuelLog);
        log.info("Fuel log saved with id: {}", saved.getId());
        return fuelLogMapper.toDto(saved);
    }

    @Override
    public FuelLogResponseDTO updateFuelLog(Long id, FuelLogRequestDTO dto) {
        log.info("Updating fuel log id: {}", id);
        FuelLog fuelLog = getFuelLogEntity(id);
        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", dto.getVehicleId()));
        Trip trip = null;
        if (dto.getTripId() != null) {
            trip = tripRepository.findById(dto.getTripId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", dto.getTripId()));
        }
        fuelLog.setVehicle(vehicle);
        fuelLog.setTrip(trip);
        fuelLog.setVolumeLiters(dto.getVolumeLiters());
        fuelLog.setPricePerLiter(dto.getPricePerLiter());
        fuelLog.setTotalCost(dto.getVolumeLiters() * dto.getPricePerLiter());
        fuelLog.setDate(dto.getDate());
        fuelLog.setFuelStation(dto.getFuelStation());
        fuelLog.setLocation(dto.getLocation());
        fuelLog.setOdometerReading(dto.getOdometerReading());
        fuelLog.setNotes(dto.getNotes());
        return fuelLogMapper.toDto(fuelLogRepository.save(fuelLog));
    }

    @Override
    @Transactional(readOnly = true)
    public FuelLogResponseDTO getFuelLogById(Long id) {
        return fuelLogMapper.toDto(getFuelLogEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FuelLogResponseDTO> getAllFuelLogs() {
        return fuelLogRepository.findAll()
                .stream()
                .map(fuelLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FuelLogResponseDTO> getFuelLogsByVehicle(Long vehicleId) {
        return fuelLogRepository.findByVehicleId(vehicleId)
                .stream()
                .map(fuelLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteFuelLog(Long id) {
        log.info("Deleting fuel log id: {}", id);
        fuelLogRepository.delete(getFuelLogEntity(id));
    }

    private FuelLog getFuelLogEntity(Long id) {
        return fuelLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FuelLog", "id", id));
    }
}
