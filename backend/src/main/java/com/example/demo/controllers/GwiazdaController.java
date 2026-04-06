package com.example.demo.controllers;

import com.example.demo.Gwiazda;
import com.example.demo.Uzytkownik;
import com.example.demo.dto.GwiazdaDTO;
import com.example.demo.exceptions.GlobalExceptionHandler;
import com.example.demo.mappers.GwiazdaMapper;
import com.example.demo.repositories.GalaktykaRepository;
import com.example.demo.repositories.GwiazdaRepository;
import com.example.demo.repositories.GwiazdozbiorRepository;
import com.example.demo.repositories.UzytkownikRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import jakarta.persistence.criteria.Predicate;

import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/gwiazdy")
public class GwiazdaController {

    @Autowired
    private GwiazdaRepository repo;

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private GalaktykaRepository galaktykaRepository;

    @Autowired
    private GwiazdozbiorRepository gwiazdozbiorRepository;


    @GetMapping
    public ResponseEntity<?> wszystkieGwiazdy() {
        try {
            List<GwiazdaDTO> lista = repo.findAll()
                    .stream()
                    .map(GwiazdaMapper::toDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(CollectionModel.of(
                    lista,
                    linkTo(methodOn(GwiazdaController.class).wszystkieGwiazdy()).withSelfRel()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(
                    new GlobalExceptionHandler.ErrorResponse(true, e.getMessage())
            );
        }
    }

  
    // ==============================
    // POST 
    // ==============================
    @PostMapping("/add")
    public ResponseEntity<?> dodajGwiazde(@RequestBody GwiazdaDTO dto) {
        try {
            Gwiazda g = GwiazdaMapper.toEntity(dto);

            if (dto.getGalaktykaId() != null) {
                Optional<?> gal = galaktykaRepository.findById(dto.getGalaktykaId());
                if (gal.isEmpty())
                    return ResponseEntity.ok(
                            new GlobalExceptionHandler.ErrorResponse(true, "Galaktyka nie istnieje")
                    );
                g.setGalaktyka((com.example.demo.Galaktyka) gal.get());
            }

            if (dto.getGwiazdozbiorId() != null) {
                Optional<?> gw = gwiazdozbiorRepository.findById(dto.getGwiazdozbiorId());
                if (gw.isEmpty())
                    return ResponseEntity.ok(
                            new GlobalExceptionHandler.ErrorResponse(true, "Gwiazdozbiór nie istnieje")
                    );
                g.setGwiazdozbior((com.example.demo.Gwiazdozbior) gw.get());
            }

            if (dto.getUtworzylUsername() != null) {
                Optional<Uzytkownik> u = uzytkownikRepository.findByUsername(dto.getUtworzylUsername());
                if (u.isEmpty())
                    return ResponseEntity.ok(
                            new GlobalExceptionHandler.ErrorResponse(true, "Użytkownik nie istnieje")
                    );
                g.setUtworzyl(u.get());
            }

            return ResponseEntity.ok(GwiazdaMapper.toDto(repo.save(g)));

        } catch (Exception e) {
            return ResponseEntity.ok(
                    new GlobalExceptionHandler.ErrorResponse(true, e.getMessage())
            );
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody GwiazdaDTO dto) {
        try {
            Optional<Gwiazda> opt = repo.findById(id);
            if (opt.isEmpty())
                return ResponseEntity.ok(
                        new GlobalExceptionHandler.ErrorResponse(true, "Nie znaleziono gwiazdy o ID: " + id)
                );

            if (dto.getUtworzylUsername() == null)
                return ResponseEntity.ok(
                        new GlobalExceptionHandler.ErrorResponse(true, "Brak informacji o użytkowniku")
                );

            Optional<Uzytkownik> userOpt = uzytkownikRepository.findByUsername(dto.getUtworzylUsername());
            if (userOpt.isEmpty())
                return ResponseEntity.ok(
                        new GlobalExceptionHandler.ErrorResponse(true, "Użytkownik nie istnieje")
                );

            Gwiazda gwiazda = opt.get();
            Uzytkownik user = userOpt.get();

            boolean isAdmin = user.getRole().stream()
                    .anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN"));

            String autor = gwiazda.getUtworzyl() != null
                    ? gwiazda.getUtworzyl().getUsername()
                    : null;

            if (!isAdmin && (autor == null || !autor.equals(user.getUsername())))
                return ResponseEntity.ok(
                        new GlobalExceptionHandler.ErrorResponse(true, "Brak uprawnień do edycji tej gwiazdy")
                );

            gwiazda.setNazwa(dto.getNazwa());
            gwiazda.setMasa(dto.getMasa());
            gwiazda.setPromien(dto.getPromien());
            gwiazda.setTypSpektralny(dto.getTypSpektralny());
            gwiazda.setJasnosc(dto.getJasnosc());
            gwiazda.setTemperatura(dto.getTemperatura());

            Gwiazda saved = repo.save(gwiazda);

            return ResponseEntity.ok(
                    EntityModel.of(
                            GwiazdaMapper.toDto(saved),
                            linkTo(methodOn(GwiazdaController.class)
                                    .szczegolyGwiazdy(saved.getId()))
                                    .withSelfRel()
                    )
            );

        } catch (Exception e) {
            return ResponseEntity.ok(
                    new GlobalExceptionHandler.ErrorResponse(true, e.getMessage())
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id, @RequestParam String username) {
        try {
            Optional<Gwiazda> opt = repo.findById(id);
            if (opt.isEmpty())
                return ResponseEntity.ok(
                        new GlobalExceptionHandler.ErrorResponse(true, "Nie znaleziono gwiazdy")
                );

            Optional<Uzytkownik> userOpt = uzytkownikRepository.findByUsername(username);
            if (userOpt.isEmpty())
                return ResponseEntity.ok(
                        new GlobalExceptionHandler.ErrorResponse(true, "Użytkownik nie istnieje")
                );

            Gwiazda gwiazda = opt.get();
            Uzytkownik user = userOpt.get();

            boolean isAdmin = user.getRole().stream()
                    .anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN"));

            String autor = gwiazda.getUtworzyl() != null
                    ? gwiazda.getUtworzyl().getUsername()
                    : null;

            if (!isAdmin && (autor == null || !autor.equals(username)))
                return ResponseEntity.ok(
                        new GlobalExceptionHandler.ErrorResponse(true, "Brak uprawnień do usunięcia gwiazdy")
                );

            repo.delete(gwiazda);
            return ResponseEntity.ok("Gwiazda usunięta");

        } catch (Exception e) {
            return ResponseEntity.ok(
                    new GlobalExceptionHandler.ErrorResponse(true, e.getMessage())
            );
        }
    }



    // ==============================
    // GET (filtrowanie gwiazd)
    // ==============================
    @GetMapping("/filter")
    public CollectionModel<EntityModel<GwiazdaDTO>> filterGwiazdy(
            @RequestParam(required = false) String nazwa,
            @RequestParam(required = false) String typSpektralny,
            @RequestParam(required = false) Double masaMin,
            @RequestParam(required = false) Double masaMax,
            @RequestParam(required = false) Double promienMin,
            @RequestParam(required = false) Double promienMax,
            @RequestParam(required = false) Long jasnoscMin,
            @RequestParam(required = false) Long jasnoscMax,
            @RequestParam(required = false) Double temperaturaMin,
            @RequestParam(required = false) Double temperaturaMax,
            @RequestParam(required = false) Integer galaktykaId,
            @RequestParam(required = false) Integer gwiazdozbiorId
    ) {

        Specification<Gwiazda> spec = (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();

            if (nazwa != null)
                p.add(cb.like(cb.lower(root.get("nazwa")), "%" + nazwa.toLowerCase() + "%"));

            if (typSpektralny != null)
                p.add(cb.like(cb.lower(root.get("typSpektralny")), "%" + typSpektralny.toLowerCase() + "%"));

            if (masaMin != null)
                p.add(cb.greaterThanOrEqualTo(root.get("masa"), masaMin));

            if (masaMax != null)
                p.add(cb.lessThanOrEqualTo(root.get("masa"), masaMax));

            if (promienMin != null)
                p.add(cb.greaterThanOrEqualTo(root.get("promien"), promienMin));

            if (promienMax != null)
                p.add(cb.lessThanOrEqualTo(root.get("promien"), promienMax));

            if (jasnoscMin != null)
                p.add(cb.greaterThanOrEqualTo(root.get("jasnosc"), jasnoscMin));

            if (jasnoscMax != null)
                p.add(cb.lessThanOrEqualTo(root.get("jasnosc"), jasnoscMax));

            if (temperaturaMin != null)
                p.add(cb.greaterThanOrEqualTo(root.get("temperatura"), temperaturaMin));

            if (temperaturaMax != null)
                p.add(cb.lessThanOrEqualTo(root.get("temperatura"), temperaturaMax));

            if (galaktykaId != null)
                p.add(cb.equal(root.get("galaktyka").get("id"), galaktykaId));

            if (gwiazdozbiorId != null)
                p.add(cb.equal(root.get("gwiazdozbior").get("id"), gwiazdozbiorId));

            return cb.and(p.toArray(new Predicate[0]));
        };

        List<EntityModel<GwiazdaDTO>> wynik =
                repo.findAll(spec).stream()
                    .map(GwiazdaMapper::toDto)
                    .map(dto -> EntityModel.of(
                            dto,
                            linkTo(methodOn(GwiazdaController.class)
                                    .szczegolyGwiazdy(dto.getId())).withSelfRel()
                    ))
                    .toList();

        return CollectionModel.of(wynik);
    }

    // ==============================
    // GET (szczegóły gwiazdy)
    // ==============================
    @GetMapping("/{id}")
    public ResponseEntity<?> szczegolyGwiazdy(@PathVariable int id) {
        try {
            Optional<GwiazdaDTO> opt = repo.findById(id).map(GwiazdaMapper::toDto);
            if (opt.isPresent()) return ResponseEntity.ok(opt.get());
            else return ResponseEntity.ok(new GlobalExceptionHandler.ErrorResponse(true, "Nie znaleziono gwiazdy."));
        } catch (Exception e) {
            return ResponseEntity.ok(new GlobalExceptionHandler.ErrorResponse(true, e.getMessage()));
        }
    }
 // ==============================
 // sortowanie
 // ==============================
    @GetMapping("/sort")
    public CollectionModel<EntityModel<GwiazdaDTO>> sortGwiazdy(
            @RequestParam(defaultValue = "nazwa") String by,
            @RequestParam(defaultValue = "asc") String dir
    ) {

        Sort sort = Sort.by(
                dir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC,
                mapSortField(by)
        );

        List<EntityModel<GwiazdaDTO>> wynik =
                repo.findAll(sort).stream()
                    .map(GwiazdaMapper::toDto)
                    .map(dto -> EntityModel.of(
                            dto,
                            linkTo(methodOn(GwiazdaController.class)
                                    .szczegolyGwiazdy(dto.getId())).withSelfRel()
                    ))
                    .toList();

        return CollectionModel.of(wynik);
    }

    private String mapSortField(String by) {
        return switch (by.toLowerCase()) {
            case "masa" -> "masa";
            case "promien" -> "promien";
            case "temperatura" -> "temperatura";
            case "jasnosc" -> "jasnosc";
            case "typspektralny" -> "typSpektralny";
            case "galaktyka" -> "galaktyka.nazwa";
            case "gwiazdozbior" -> "gwiazdozbior.nazwa";
            default -> "nazwa";
        };
    }


}
