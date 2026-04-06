package com.example.demo.mappers;

import com.example.demo.Asteroida;
import com.example.demo.controllers.*;
import com.example.demo.dto.AsteroidaDTO;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

public class AsteroidaMapper {

    public static AsteroidaDTO toDto(Asteroida a) {
        if (a == null) return null;

        AsteroidaDTO dto = new AsteroidaDTO();
        dto.setId(a.getId());
        dto.setNazwa(a.getNazwa());
        dto.setMasa(a.getMasa());
        dto.setSrednica(a.getSrednica());
        dto.setSklad(a.getSklad());
        dto.setOrbita(a.getOrbita());
        dto.setCreatedAt(a.getCreatedAt());

        if (a.getGalaktyka() != null) {
            dto.setGalaktykaId(a.getGalaktyka().getId());
            dto.setGalaktykaNazwa(a.getGalaktyka().getNazwa());
            dto.add(linkTo(methodOn(GalaktykaController.class)
                    .szczegolyGalaktyki(a.getGalaktyka().getId())).withRel("galaktyka"));
        }

        if (a.getUtworzyl() != null) {
            dto.setUtworzylId(a.getUtworzyl().getId());
            dto.setUtworzylUsername(a.getUtworzyl().getUsername());
            dto.add(linkTo(methodOn(UzytkownikController.class)
                    .getById(a.getUtworzyl().getId())).withRel("utworzyl"));
        }

        dto.add(linkTo(methodOn(AsteroidaController.class)
                .getAsteroidaById(a.getId())).withSelfRel());

        return dto;
    }

    public static Asteroida toEntity(AsteroidaDTO dto) {
        if (dto == null) return null;
        Asteroida a = new Asteroida();
        a.setId(dto.getId());
        a.setNazwa(dto.getNazwa());
        a.setMasa(dto.getMasa());
        a.setSrednica(dto.getSrednica());
        a.setSklad(dto.getSklad());
        a.setOrbita(dto.getOrbita());
        a.setCreatedAt(dto.getCreatedAt());
        return a;
    }
}
