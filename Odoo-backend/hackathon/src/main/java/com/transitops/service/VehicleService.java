package com.transitops.service;

import com.transitops.entity.Vehicle;
import com.transitops.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        if (vehicleRepository.existsByRegistrationNumber(vehicle.getRegistrationNumber())) {
            throw new IllegalArgumentException("Registration number must be unique");
        }
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle updatedVehicle) {
        Vehicle vehicle = getVehicleById(id);
        
        // If registration number is changed, check uniqueness
        if (!vehicle.getRegistrationNumber().equals(updatedVehicle.getRegistrationNumber()) && 
            vehicleRepository.existsByRegistrationNumber(updatedVehicle.getRegistrationNumber())) {
            throw new IllegalArgumentException("Registration number must be unique");
        }

        vehicle.setRegistrationNumber(updatedVehicle.getRegistrationNumber());
        vehicle.setModel(updatedVehicle.getModel());
        vehicle.setVehicleType(updatedVehicle.getVehicleType());
        vehicle.setCapacity(updatedVehicle.getCapacity());
        vehicle.setOdometer(updatedVehicle.getOdometer());
        vehicle.setAcquisitionCost(updatedVehicle.getAcquisitionCost());
        vehicle.setStatus(updatedVehicle.getStatus());

        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }
}
