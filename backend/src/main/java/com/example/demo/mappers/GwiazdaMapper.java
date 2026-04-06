package com.example.demo.mappers;

import com.example.demo.Gwiazda;
import com.example.demo.controllers.*;
import com.example.demo.dto.GwiazdaDTO;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

public class GwiazdaMapper {

	public static GwiazdaDTO toDto(Gwiazda g) {
	    if (g == null) return null;

	    GwiazdaDTO dto = new GwiazdaDTO();
	    dto.setId(g.getId());
	    dto.setNazwa(g.getNazwa());
	    dto.setMasa(g.getMasa());
	    dto.setPromien(g.getPromien());
	    dto.setTypSpektralny(g.getTypSpektralny());
	    dto.setJasnosc(g.getJasnosc());
	    dto.setTemperatura(g.getTemperatura());


	    if (g.getGalaktyka() != null) {
	        dto.setGalaktykaId(g.getGalaktyka().getId());
	        dto.setGalaktykaNazwa(g.getGalaktyka().getNazwa());
	        dto.add(linkTo(methodOn(GalaktykaController.class)
	            .szczegolyGalaktyki(g.getGalaktyka().getId())).withRel("galaktyka"));
	    }

	    if (g.getGwiazdozbior() != null) {
	        dto.setGwiazdozbiorId(g.getGwiazdozbior().getId());
	        dto.setGwiazdozbiorNazwa(g.getGwiazdozbior().getNazwa());
	        dto.add(linkTo(methodOn(GwiazdozbiorController.class)
	                .getById(g.getGwiazdozbior().getId())).withRel("gwiazdozbior"));
	    }

	    if (g.getUtworzyl() != null) {
	        dto.setUtworzylId(g.getUtworzyl().getId());
	        dto.setUtworzylUsername(g.getUtworzyl().getUsername());
	        dto.add(linkTo(methodOn(UzytkownikController.class)
	                .getById(g.getUtworzyl().getId())).withRel("utworzyl"));
	    }

	    dto.add(linkTo(methodOn(GwiazdaController.class)
	            .szczegolyGwiazdy(g.getId())).withSelfRel());

	    return dto;
    }
	
	public static Gwiazda toEntity(GwiazdaDTO dto) {
	    if (dto == null) return null;

	    Gwiazda g = new Gwiazda();
	    g.setId(dto.getId()); 
	    g.setNazwa(dto.getNazwa());
	    g.setMasa(dto.getMasa());
	    g.setPromien(dto.getPromien());
	    g.setTypSpektralny(dto.getTypSpektralny());
	    g.setJasnosc(dto.getJasnosc());
	    g.setTemperatura(dto.getTemperatura());

	    return g;
	}
}
