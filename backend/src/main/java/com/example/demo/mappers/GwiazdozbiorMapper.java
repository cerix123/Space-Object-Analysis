package com.example.demo.mappers;

import com.example.demo.Gwiazdozbior;
import com.example.demo.Uzytkownik;
import com.example.demo.dto.GwiazdozbiorDTO;

public class GwiazdozbiorMapper {

	public static GwiazdozbiorDTO toDTO(Gwiazdozbior entity) {
	    if (entity == null) return null;

	    GwiazdozbiorDTO dto = new GwiazdozbiorDTO();
	    dto.setId(entity.getId());
	    dto.setNazwa(entity.getNazwa());
	    dto.setOpis(entity.getOpis());

	    if (entity.getGalaktyka() != null) {
	        dto.setGalaktykaId(entity.getGalaktyka().getId());
	        dto.setGalaktykaNazwa(entity.getGalaktyka().getNazwa());
	    }

	    if (entity.getUtworzyl() != null) {
	        dto.setUtworzylUsername(entity.getUtworzyl().getUsername());
	    }

	    if (entity.getGwiazdy() != null) {
	        dto.setGwiazdyNazwa(
	            entity.getGwiazdy().stream()
	                  .map(g -> g.getNazwa())
	                  .toList()
	        );
	    }

	    dto.setCreatedAt(entity.getCreatedAt());
	    return dto;
	}


    public static Gwiazdozbior toEntity(GwiazdozbiorDTO dto) {
        if (dto == null) return null;

        Gwiazdozbior entity = new Gwiazdozbior();
        entity.setId(dto.getId());
        entity.setNazwa(dto.getNazwa());
        entity.setOpis(dto.getOpis());
        entity.setCreatedAt(dto.getCreatedAt());
        return entity;
    }
}
