package com.example.demo.mappers;

import com.example.demo.Planeta;
import com.example.demo.dto.PlanetaDTO;

public class PlanetaMapper {

    public static PlanetaDTO toDto(Planeta planeta) {
        PlanetaDTO dto = new PlanetaDTO();
        dto.setId(planeta.getId());
        dto.setNazwa(planeta.getNazwa());
        dto.setMasa(planeta.getMasa());
        dto.setPromien(planeta.getPromien());
        dto.setMaAtmosfere(planeta.getMaAtmosfere());
        dto.setOdlegloscOdGwiazdy(planeta.getOdlegloscOdGwiazdy());
        dto.setCreatedAt(planeta.getCreatedAt());

        if (planeta.getGwiazda() != null) {
            dto.setGwiazdaId(planeta.getGwiazda().getId());
            dto.setGwiazdaNazwa(planeta.getGwiazda().getNazwa());
        }

        if (planeta.getGalaktyka() != null) {
            dto.setGalaktykaId(planeta.getGalaktyka().getId());
            dto.setGalaktykaNazwa(planeta.getGalaktyka().getNazwa());
        }

        if (planeta.getUtworzyl() != null) {
            dto.setUtworzylId(planeta.getUtworzyl().getId());
            dto.setUtworzylUsername(planeta.getUtworzyl().getUsername());
        }

        return dto;
    }

    public static Planeta toEntity(PlanetaDTO dto) {
        Planeta planeta = new Planeta();
        planeta.setId(dto.getId());
        planeta.setNazwa(dto.getNazwa());
        planeta.setMasa(dto.getMasa());
        planeta.setPromien(dto.getPromien());
        planeta.setMaAtmosfere(dto.getMaAtmosfere());
        planeta.setOdlegloscOdGwiazdy(dto.getOdlegloscOdGwiazdy());
        planeta.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : java.time.LocalDateTime.now());
        return planeta;
    }
}


