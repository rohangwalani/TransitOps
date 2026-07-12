package com.transitops.mapper;

import com.transitops.dto.request.VehicleRequestDTO;
import com.transitops.dto.response.VehicleResponseDTO;
import com.transitops.entity.Vehicle;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface VehicleMapper {
    VehicleMapper INSTANCE = Mappers.getMapper(VehicleMapper.class);

    VehicleResponseDTO toDto(Vehicle vehicle);

    Vehicle toEntity(VehicleRequestDTO vehicleRequestDTO);

    void updateEntityFromDto(VehicleRequestDTO vehicleRequestDTO, @MappingTarget Vehicle vehicle);
}
