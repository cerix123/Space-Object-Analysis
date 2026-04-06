package com.example.demo.mappers;

import com.example.demo.CzarnaDziura;
import com.example.demo.dto.CzarnaDziuraDTO;

public class CzarnaDziuraMapper {

    public static CzarnaDziuraDTO toDto(CzarnaDziura dziura) {
        if (dziura == null) return null;

        CzarnaDziuraDTO dto = new CzarnaDziuraDTO();
        dto.setId(dziura.getId());
        dto.setNazwa(dziura.getNazwa());
        dto.setMasa(dziura.getMasa());
        dto.setPromienSchwarzschilda(dziura.getPromienSchwarzschilda());
        dto.setTyp(dziura.getTyp());
        dto.setCreatedAt(dziura.getCreatedAt());

        if (dziura.getGalaktyka() != null) {
            dto.setGalaktykaId(dziura.getGalaktyka().getId());
            dto.setGalaktykaNazwa(dziura.getGalaktyka().getNazwa());
        }

        if (dziura.getUtworzyl() != null) {
            dto.setUtworzylId(dziura.getUtworzyl().getId());
            dto.setUtworzylUsername(dziura.getUtworzyl().getUsername());
        }

        return dto;
    }

    public static CzarnaDziura toEntity(CzarnaDziuraDTO dto) {
        if (dto == null) return null;

        CzarnaDziura dziura = new CzarnaDziura();
        dziura.setId(dto.getId());
        dziura.setNazwa(dto.getNazwa());
        dziura.setMasa(dto.getMasa());
        dziura.setPromienSchwarzschilda(dto.getPromienSchwarzschilda());
        dziura.setTyp(dto.getTyp());
        dziura.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : java.time.LocalDateTime.now());

        return dziura;
    }
}
