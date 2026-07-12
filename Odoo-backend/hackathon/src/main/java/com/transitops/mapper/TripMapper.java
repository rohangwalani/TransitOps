package com.transitops.mapper;

import com.transitops.dto.request.TripRequestDTO;
import com.transitops.dto.response.TripResponseDTO;
import com.transitops.entity.Trip;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {VehicleMapper.class, DriverMapper.class})
public interface TripMapper {
    TripMapper INSTANCE = Mappers.getMapper(TripMapper.class);

    TripResponseDTO toDto(Trip trip);

    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "driver", ignore = true)
    Trip toEntity(TripRequestDTO tripRequestDTO);

    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "driver", ignore = true)
    void updateEntityFromDto(TripRequestDTO tripRequestDTO, @MappingTarget Trip trip);
}
