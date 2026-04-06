package com.example.demo.mappers;

import com.example.demo.Rola;
import com.example.demo.dto.RolaDTO;
import java.util.stream.Collectors;

public class RolaMapper {

    public static RolaDTO toDto(Rola rola) {
        RolaDTO dto = new RolaDTO();
        dto.setId(rola.getId());
        dto.setNazwa(rola.getNazwa());

        if (rola.getUzytkownicy() != null) {
            dto.setUzytkownicyIds(rola.getUzytkownicy()
                .stream()
                .map(u -> u.getId())
                .collect(Collectors.toSet()));
        }

        return dto;
    }

    public static Rola toEntity(RolaDTO dto) {
        Rola rola = new Rola();
        rola.setId(dto.getId());
        rola.setNazwa(dto.getNazwa());
        return rola;
    }
}
