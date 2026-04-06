package com.example.demo.mappers;

import com.example.demo.Uzytkownik;
import com.example.demo.dto.UzytkownikDTO;
import java.util.stream.Collectors;

public class UzytkownikMapper {

    public static UzytkownikDTO toDto(Uzytkownik uzytkownik) {
        UzytkownikDTO dto = new UzytkownikDTO();
        dto.setId(uzytkownik.getId());
        dto.setUsername(uzytkownik.getUsername());
        dto.setEmail(uzytkownik.getEmail());
        dto.setAktywny(uzytkownik.getAktywny());
        dto.setCreatedAt(uzytkownik.getCreatedAt());

        if (uzytkownik.getRole() != null) {
            dto.setRoleIds(uzytkownik.getRole()
                .stream()
                .map(r -> r.getId())
                .collect(Collectors.toSet()));

            dto.setRoleNames(uzytkownik.getRole()
                .stream()
                .map(r -> r.getNazwa())
                .collect(Collectors.toSet())); 
        }

        return dto;
    }

    public static Uzytkownik toEntity(UzytkownikDTO dto) {
        Uzytkownik u = new Uzytkownik();
        u.setId(dto.getId());
        u.setUsername(dto.getUsername());
        u.setEmail(dto.getEmail());
        u.setAktywny(dto.getAktywny() != null ? dto.getAktywny() : true);
        u.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : java.time.LocalDateTime.now());
        return u;
    }
}
