package com.example.demo.mappers;

import com.example.demo.Ksiezyc;
import com.example.demo.dto.KsiezycDTO;

public class KsiezycMapper {

    public static KsiezycDTO toDTO(Ksiezyc entity) {
        if (entity == null) return null;

        KsiezycDTO dto = new KsiezycDTO();
        dto.setId(entity.getId());
        dto.setNazwa(entity.getNazwa());
        dto.setMasa(entity.getMasa());
        dto.setPromien(entity.getPromien());
        dto.setOdlegloscOdPlanety(entity.getOdlegloscOdPlanety());
        dto.setCreatedAt(entity.getCreatedAt());

        if (entity.getPlaneta() != null) {
            dto.setPlanetaId(entity.getPlaneta().getId());
            dto.setPlanetaNazwa(entity.getPlaneta().getNazwa());
        }

        if (entity.getGalaktyka() != null) {
            dto.setGalaktykaId(entity.getGalaktyka().getId());
            dto.setGalaktykaNazwa(entity.getGalaktyka().getNazwa());
        }

        if (entity.getUtworzyl() != null) {
            dto.setUtworzylId(entity.getUtworzyl().getId());
            dto.setUtworzylLogin(entity.getUtworzyl().getUsername());
            dto.setUtworzylUsername(entity.getUtworzyl().getUsername());
        }

        return dto;
    }

    public static Ksiezyc toEntity(KsiezycDTO dto) {
        if (dto == null) return null;

        Ksiezyc entity = new Ksiezyc();
        entity.setId(dto.getId());
        entity.setNazwa(dto.getNazwa());
        entity.setMasa(dto.getMasa());
        entity.setPromien(dto.getPromien());
        entity.setOdlegloscOdPlanety(dto.getOdlegloscOdPlanety());
        entity.setCreatedAt(dto.getCreatedAt());
        return entity;
    }
}
