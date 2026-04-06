package com.example.demo.controllers;

import com.example.demo.Rola;
import com.example.demo.Uzytkownik;
import com.example.demo.dto.UzytkownikDTO;
import com.example.demo.dto.ProfilDTO;
import com.example.demo.dto.ZmianaHaslaDTO;
import com.example.demo.exceptions.GlobalExceptionHandler;
import com.example.demo.mappers.UzytkownikMapper;
import com.example.demo.repositories.RolaRepository;
import com.example.demo.repositories.UzytkownikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/uzytkownicy")
public class UzytkownikController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private RolaRepository rolaRepository;

    
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<EntityModel<UzytkownikDTO>> users = uzytkownikRepository.findAll().stream()
                    .map(UzytkownikMapper::toDto)
                    .map(dto -> EntityModel.of(dto,
                            linkTo(methodOn(UzytkownikController.class)
                                    .getById(dto.getId())).withSelfRel()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(
                    CollectionModel.of(users,
                            linkTo(methodOn(UzytkownikController.class).getAll()).withSelfRel())
            );
        } catch (Exception e) {
            return ResponseEntity.ok(
                    new GlobalExceptionHandler.ErrorResponse(true, e.getMessage())
            );
        }
    }

    @GetMapping("/{id}")
    public EntityModel<UzytkownikDTO> getById(@PathVariable Integer id) {
        Uzytkownik u = uzytkownikRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika o ID: " + id));
        UzytkownikDTO dto = UzytkownikMapper.toDto(u);

        return EntityModel.of(dto,
                linkTo(methodOn(UzytkownikController.class).getById(id)).withSelfRel(),
                linkTo(methodOn(UzytkownikController.class).getAll()).withRel("wszystkie"));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody UzytkownikDTO dto) {
        try {
            Uzytkownik u = UzytkownikMapper.toEntity(dto);
            u.setPassword(passwordEncoder.encode(u.getPassword()));
            Uzytkownik saved = uzytkownikRepository.save(u);

            return ResponseEntity.ok(
                    EntityModel.of(UzytkownikMapper.toDto(saved),
                            linkTo(methodOn(UzytkownikController.class)
                                    .getById(saved.getId())).withSelfRel())
            );
        } catch (Exception e) {
            return ResponseEntity.ok(
                    new GlobalExceptionHandler.ErrorResponse(true, e.getMessage())
            );
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id,
                                    @RequestBody UzytkownikDTO dto) {
        try {
            Optional<Uzytkownik> opt = uzytkownikRepository.findById(id);
            if (opt.isEmpty())
                return ResponseEntity.ok(
                        new GlobalExceptionHandler.ErrorResponse(true,
                                "Nie znaleziono użytkownika o ID: " + id)
                );

            Uzytkownik u = opt.get();
            u.setUsername(dto.getUsername());
            u.setEmail(dto.getEmail());
            u.setAktywny(dto.getAktywny());

            Uzytkownik updated = uzytkownikRepository.save(u);

            return ResponseEntity.ok(
                    EntityModel.of(UzytkownikMapper.toDto(updated),
                            linkTo(methodOn(UzytkownikController.class)
                                    .getById(updated.getId())).withSelfRel())
            );
        } catch (Exception e) {
            return ResponseEntity.ok(
                    new GlobalExceptionHandler.ErrorResponse(true, e.getMessage())
            );
        }
    }

    @DeleteMapping("/{id}/admin")
    public ResponseEntity<?> adminDeleteUser(
            @PathVariable Integer id,
            @RequestParam String username
    ) {
        try {
            Optional<Uzytkownik> adminOpt = uzytkownikRepository.findByUsername(username);
            if (adminOpt.isEmpty())
                return ResponseEntity.ok(
                        new GlobalExceptionHandler.ErrorResponse(true, "Admin nie istnieje")
                );

            boolean isAdmin = adminOpt.get().getRole().stream()
                    .anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN"));

            if (!isAdmin)
                return ResponseEntity.ok(
                        new GlobalExceptionHandler.ErrorResponse(true, "Brak uprawnień")
                );

            if (!uzytkownikRepository.existsById(id))
                return ResponseEntity.ok(
                        new GlobalExceptionHandler.ErrorResponse(true, "Użytkownik nie istnieje")
                );

            uzytkownikRepository.deleteById(id);
            return ResponseEntity.ok("Użytkownik usunięty");

        } catch (Exception e) {
            return ResponseEntity.ok(
                    new GlobalExceptionHandler.ErrorResponse(true, e.getMessage())
            );
        }
    }

    
    @PutMapping("/{id}/role")
    public ResponseEntity<?> adminChangeRole(
            @PathVariable Integer id,
            @RequestParam String role,
            @RequestParam String username
    ) {
        Uzytkownik admin = uzytkownikRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono admina"));

        boolean isAdmin = admin.getRole().stream()
                .anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN"));

        if (!isAdmin) {
            throw new RuntimeException("Brak uprawnień");
        }

        Uzytkownik user = uzytkownikRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        Rola nowaRola = rolaRepository.findByNazwa(role.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono roli"));

        user.getRole().clear();
        user.getRole().add(nowaRola);

        uzytkownikRepository.save(user);
        return ResponseEntity.ok("Rola zmieniona");
    }



    // ---------- NOWE ENDPOINTY DLA PROFILU ZALOGOWANEGO ----------

    @GetMapping("/me")
    public ResponseEntity<ProfilDTO> getMe(Authentication authentication) {
        if(authentication == null) return ResponseEntity.status(401).build();
        String username = authentication.getName();
        Uzytkownik u = uzytkownikRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));
        ProfilDTO dto = new ProfilDTO();
        dto.setUsername(u.getUsername());
        dto.setEmail(u.getEmail());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me")
    public ResponseEntity<ProfilDTO> updateMe(@RequestBody ProfilDTO dto, Authentication authentication) {
        if(authentication == null) return ResponseEntity.status(401).build();
        String username = authentication.getName();
        Uzytkownik u = uzytkownikRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        if(dto.getUsername() != null) u.setUsername(dto.getUsername());
        if(dto.getEmail() != null) u.setEmail(dto.getEmail());

        uzytkownikRepository.save(u);

        ProfilDTO updatedDto = new ProfilDTO();
        updatedDto.setUsername(u.getUsername());
        updatedDto.setEmail(u.getEmail());
        return ResponseEntity.ok(updatedDto);
    }

    @PutMapping("/me/password")
    public ResponseEntity<String> updateMyPassword(@RequestBody ZmianaHaslaDTO dto, Authentication authentication) {
        if(authentication == null) return ResponseEntity.status(401).build();
        String username = authentication.getName();
        Uzytkownik u = uzytkownikRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        if(dto.getPassword() == null || dto.getPassword().isEmpty())
            return ResponseEntity.badRequest().body("Hasło nie może być puste");

        u.setPassword(passwordEncoder.encode(dto.getPassword()));
        uzytkownikRepository.save(u);
        return ResponseEntity.ok("Hasło zmienione");
    }
    
 // ---------- ADMIN: EDYCJA DANYCH DOWOLNEGO UŻYTKOWNIKA ----------
    @PutMapping("/{id}/admin")
    public ResponseEntity<?> adminUpdateUser(
            @PathVariable Integer id,
            @RequestBody Map<String, String> updates,
            @RequestParam String username
    ) {
        Uzytkownik admin = uzytkownikRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        boolean isAdmin = admin.getRole().stream()
                .anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN"));

        if (!isAdmin) {
            throw new RuntimeException("Brak uprawnień do edycji użytkownika");
        }

        Uzytkownik user = uzytkownikRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        if (updates.containsKey("username") && !updates.get("username").isBlank()) {
            user.setUsername(updates.get("username"));
        }

        if (updates.containsKey("email") && !updates.get("email").isBlank()) {
            user.setEmail(updates.get("email"));
        }

        if (updates.containsKey("password") && !updates.get("password").isBlank()) {
            user.setPassword(passwordEncoder.encode(updates.get("password")));
        }

        Uzytkownik saved = uzytkownikRepository.save(user);
        return ResponseEntity.ok(UzytkownikMapper.toDto(saved));
    }


}
