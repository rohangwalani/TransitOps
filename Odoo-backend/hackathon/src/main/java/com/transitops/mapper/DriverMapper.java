package com.transitops.mapper;

import com.transitops.dto.request.DriverRequestDTO;
import com.transitops.dto.response.DriverResponseDTO;
import com.transitops.entity.Driver;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DriverMapper {
    DriverMapper INSTANCE = Mappers.getMapper(DriverMapper.class);

    DriverResponseDTO toDto(Driver driver);

    Driver toEntity(DriverRequestDTO driverRequestDTO);

    void updateEntityFromDto(DriverRequestDTO driverRequestDTO, @MappingTarget Driver driver);
}
