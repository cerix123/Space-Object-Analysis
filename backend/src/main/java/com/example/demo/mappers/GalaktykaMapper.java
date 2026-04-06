package com.example.demo.mappers;

import com.example.demo.*;
import com.example.demo.controllers.GalaktykaController;
import com.example.demo.controllers.UzytkownikController;
import com.example.demo.dto.GalaktykaDTO;

import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

public class GalaktykaMapper {

    public static GalaktykaDTO toDto(Galaktyka g) {
        if (g == null) return null;

        GalaktykaDTO dto = new GalaktykaDTO();

        dto.setId(g.getId());
        dto.setNazwa(g.getNazwa());
        dto.setTyp(g.getTyp());
        dto.setSrednica(g.getSrednica());
        dto.setLiczbaGwiazd(g.getLiczbaGwiazd());
        dto.setCreatedAt(g.getCreatedAt());


        if (g.getUtworzyl() != null) {
            dto.setIdUtworzyl(g.getUtworzyl().getId());
            dto.setNazwaUtworzyl(g.getUtworzyl().getUsername());
            dto.add(linkTo(methodOn(UzytkownikController.class)
                    .getById(g.getUtworzyl().getId())).withRel("utworzyl"));
        }


        if (g.getGwiazdy() != null)
            dto.setGwiazdy(g.getGwiazdy().stream().map(Gwiazda::getNazwa).collect(Collectors.toList()));

        if (g.getPlanety() != null)
            dto.setPlanety(g.getPlanety().stream().map(Planeta::getNazwa).collect(Collectors.toList()));

        if (g.getKsiezyce() != null)
            dto.setKsiezyce(g.getKsiezyce().stream().map(Ksiezyc::getNazwa).collect(Collectors.toList()));

        if (g.getGwiazdozbiory() != null)
            dto.setGwiazdozbiory(g.getGwiazdozbiory().stream().map(Gwiazdozbior::getNazwa).collect(Collectors.toList()));

        if (g.getAsteroidy() != null)
            dto.setAsteroidy(g.getAsteroidy().stream().map(Asteroida::getNazwa).collect(Collectors.toList()));

        if (g.getCzarneDziury() != null)
            dto.setCzarneDziury(g.getCzarneDziury().stream().map(CzarnaDziura::getNazwa).collect(Collectors.toList()));


        dto.add(linkTo(methodOn(GalaktykaController.class)
                .szczegolyGalaktyki(g.getId())).withSelfRel());

        return dto;
    }
}
