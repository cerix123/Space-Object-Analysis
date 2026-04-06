package com.example.demo.controllers;

import com.example.demo.Asteroida;
import com.example.demo.Galaktyka;
import com.example.demo.Uzytkownik;
import com.example.demo.dto.AsteroidaDTO;
import com.example.demo.exceptions.GlobalExceptionHandler;
import com.example.demo.mappers.AsteroidaMapper;
import com.example.demo.repositories.AsteroidaRepository;
import com.example.demo.repositories.GalaktykaRepository;
import com.example.demo.repositories.UzytkownikRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.criteria.Predicate;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/asteroidy")
public class AsteroidaController {

    @Autowired
    private AsteroidaRepository repo;

    @Autowired
    private GalaktykaRepository galaktykaRepo;

    @Autowired
    private UzytkownikRepository uzytkownikRepo;

    // ---------------- DODAWANIE ----------------
    @PostMapping
    public EntityModel<AsteroidaDTO> create(@RequestBody AsteroidaDTO dto) {
        Asteroida asteroida = AsteroidaMapper.toEntity(dto);

        if (dto.getGalaktykaId() != null) {
            galaktykaRepo.findById(dto.getGalaktykaId()).ifPresent(asteroida::setGalaktyka);
        }

        if (dto.getUtworzylUsername() != null) {
            Uzytkownik user = uzytkownikRepo.findByUsername(dto.getUtworzylUsername()).orElse(null);
            if (user != null) asteroida.setUtworzyl(user);
        }

        Asteroida saved = repo.save(asteroida);
        AsteroidaDTO savedDto = AsteroidaMapper.toDto(saved);

        if (saved.getUtworzyl() != null)
            savedDto.setUtworzylUsername(saved.getUtworzyl().getUsername());

        return EntityModel.of(savedDto,
                linkTo(methodOn(AsteroidaController.class).getAsteroidaById(saved.getId())).withSelfRel());
    }

    // ---------------- UPDATE ----------------
    @PutMapping("/{id}")
    public EntityModel<AsteroidaDTO> update(@PathVariable Integer id, @RequestBody AsteroidaDTO dto, @RequestParam String username) {
        Asteroida asteroida = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono asteroidy o ID: " + id));

        if (dto.getGalaktykaId() != null) {
            asteroida.setGalaktyka(galaktykaRepo.findById(dto.getGalaktykaId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono galaktyki o ID: " + dto.getGalaktykaId())));
        }

        boolean isAdmin = uzytkownikRepo.findByUsername(username)
                .map(u -> u.getRole().stream().anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN")))
                .orElse(false);

        String autor = (asteroida.getUtworzyl() != null) ? asteroida.getUtworzyl().getUsername() : null;
        if (!isAdmin && (autor == null || !autor.equals(username))) {
            throw new RuntimeException("Brak uprawnień do edycji tej asteroidy!");
        }

        asteroida.setNazwa(dto.getNazwa());
        asteroida.setMasa(dto.getMasa());
        asteroida.setSrednica(dto.getSrednica());
        asteroida.setSklad(dto.getSklad());
        asteroida.setOrbita(dto.getOrbita());

        Asteroida updated = repo.save(asteroida);
        AsteroidaDTO updatedDto = AsteroidaMapper.toDto(updated);

        return EntityModel.of(updatedDto,
                linkTo(methodOn(AsteroidaController.class).getAsteroidaById(updated.getId())).withSelfRel());
    }

    // ---------------- DELETE ----------------
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id, @RequestParam String username) {
        Asteroida asteroida = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono asteroidy o ID: " + id));

        boolean isAdmin = uzytkownikRepo.findByUsername(username)
                .map(u -> u.getRole().stream().anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN")))
                .orElse(false);

        String autor = (asteroida.getUtworzyl() != null) ? asteroida.getUtworzyl().getUsername() : null;
        if (!isAdmin && (autor == null || !autor.equals(username))) {
            throw new RuntimeException("Brak uprawnień do usunięcia tej asteroidy!");
        }

        repo.delete(asteroida);
    }

    // ---------------- LISTA ----------------
    @GetMapping
    public ResponseEntity<?> wszystkieAsteroidy() {
        try {
            List<AsteroidaDTO> lista = repo.findAll().stream()
                    .map(AsteroidaMapper::toDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(CollectionModel.of(lista,
                    linkTo(methodOn(AsteroidaController.class).wszystkieAsteroidy()).withSelfRel()));
        } catch (Exception e) {
            return ResponseEntity.ok(new GlobalExceptionHandler.ErrorResponse(true, e.getMessage()));
        }
    }

    @GetMapping("/filter")
    public CollectionModel<EntityModel<AsteroidaDTO>> filterAsteroidy(
            @RequestParam(required = false) String nazwa,
            @RequestParam(required = false) Double masaMin,
            @RequestParam(required = false) Double masaMax,
            @RequestParam(required = false) Double srednicaMin,
            @RequestParam(required = false) Double srednicaMax,
            @RequestParam(required = false) String sklad,
            @RequestParam(required = false) String orbita,
            @RequestParam(required = false) Integer galaktykaId,
            @RequestParam(required = false) Integer utworzylId
    ) {
        Specification<Asteroida> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (nazwa != null) {
                predicates.add(cb.like(cb.lower(root.get("nazwa")), "%" + nazwa.toLowerCase() + "%"));
            }

            if (masaMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("masa"), masaMin));
            }

            if (masaMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("masa"), masaMax));
            }

            if (srednicaMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("srednica"), srednicaMin));
            }

            if (srednicaMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("srednica"), srednicaMax));
            }

            if (sklad != null) {
                predicates.add(cb.like(cb.lower(root.get("sklad")), "%" + sklad.toLowerCase() + "%"));
            }

            if (orbita != null) {
                predicates.add(cb.like(cb.lower(root.get("orbita")), "%" + orbita.toLowerCase() + "%"));
            }

            if (galaktykaId != null) {
                predicates.add(cb.equal(root.get("galaktyka").get("id"), galaktykaId));
            }

            if (utworzylId != null) {
                predicates.add(cb.equal(root.get("utworzyl").get("id"), utworzylId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<EntityModel<AsteroidaDTO>> wynik = repo.findAll(spec).stream()
                .map(AsteroidaMapper::toDto)
                .map(dto -> EntityModel.of(dto,
                        linkTo(methodOn(AsteroidaController.class)
                                .getAsteroidaById(dto.getId())).withSelfRel()))
                .toList();

        return CollectionModel.of(wynik);
    }
    @GetMapping("/sort")
    public ResponseEntity<?> sortAsteroidy(
            @RequestParam(defaultValue = "nazwa") String by,
            @RequestParam(defaultValue = "asc") String dir
    ) {
        try {
            List<Asteroida> lista = repo.findAll();

            Comparator<Asteroida> cmp = switch (by) {
                case "id" -> Comparator.comparing(Asteroida::getId);
                case "nazwa" -> Comparator.comparing(Asteroida::getNazwa,
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                case "masa" -> Comparator.comparing(Asteroida::getMasa,
                        Comparator.nullsLast(Double::compareTo));
                case "srednica" -> Comparator.comparing(Asteroida::getSrednica,
                        Comparator.nullsLast(Double::compareTo));
                case "sklad" -> Comparator.comparing(Asteroida::getSklad,
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                case "orbita" -> Comparator.comparing(Asteroida::getOrbita,
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                case "galaktyka" -> Comparator.comparing(
                        a -> a.getGalaktyka() != null ? a.getGalaktyka().getNazwa() : null,
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
               
                default -> Comparator.comparing(Asteroida::getNazwa,
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
            };

            if ("desc".equalsIgnoreCase(dir)) {
                lista.sort(cmp.reversed());
            } else {
                lista.sort(cmp);
            }

            List<AsteroidaDTO> wynik = lista.stream()
                    .map(AsteroidaMapper::toDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(CollectionModel.of(wynik));

        } catch (Exception e) {
            return ResponseEntity.ok(new GlobalExceptionHandler.ErrorResponse(true, e.getMessage()));
        }
    }

    // ---------------- SZCZEGÓŁY ----------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getAsteroidaById(@PathVariable int id) {
        try {
            Optional<AsteroidaDTO> dto = repo.findById(id).map(AsteroidaMapper::toDto);
            return dto.<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.ok(
                            new GlobalExceptionHandler.ErrorResponse(true, "Asteroida nie znaleziona: " + id)));
        } catch (Exception e) {
            return ResponseEntity.ok(new GlobalExceptionHandler.ErrorResponse(true, e.getMessage()));
        }
    }
}
