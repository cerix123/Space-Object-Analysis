package com.example.demo.controllers;

import com.example.demo.Planeta;
import com.example.demo.Uzytkownik;
import com.example.demo.dto.PlanetaDTO;
import com.example.demo.mappers.PlanetaMapper;
import com.example.demo.repositories.GalaktykaRepository;
import com.example.demo.repositories.GwiazdaRepository;
import com.example.demo.repositories.PlanetaRepository;
import com.example.demo.repositories.UzytkownikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/planety")
public class PlanetaController {

    @Autowired
    private PlanetaRepository planetaRepository;

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private GwiazdaRepository gwiazdaRepository;

    @Autowired
    private GalaktykaRepository galaktykaRepository;

    // ==============================
    // GET ALL
    // ==============================
    @GetMapping
    public CollectionModel<EntityModel<PlanetaDTO>> getAll() {
        List<EntityModel<PlanetaDTO>> planety = planetaRepository.findAll().stream()
                .map(PlanetaMapper::toDto)
                .map(dto -> EntityModel.of(dto,
                        linkTo(methodOn(PlanetaController.class).getById(dto.getId())).withSelfRel()))
                .collect(Collectors.toList());

        return CollectionModel.of(planety, linkTo(methodOn(PlanetaController.class).getAll()).withSelfRel());
    }

    // ==============================
    // GET BY ID
    // ==============================
    @GetMapping("/{id}")
    public EntityModel<PlanetaDTO> getById(@PathVariable Integer id) {
        Planeta planeta = planetaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono planety o ID: " + id));

        PlanetaDTO dto = PlanetaMapper.toDto(planeta);
        return EntityModel.of(dto,
                linkTo(methodOn(PlanetaController.class).getById(id)).withSelfRel(),
                linkTo(methodOn(PlanetaController.class).getAll()).withRel("wszystkie"));
    }

    // ==============================
    // CREATE
    // ==============================
    @PostMapping
    public EntityModel<PlanetaDTO> create(@RequestBody PlanetaDTO dto) {
        Planeta planeta = PlanetaMapper.toEntity(dto);

        if (dto.getGwiazdaId() != null) {
            planeta.setGwiazda(gwiazdaRepository.findById(dto.getGwiazdaId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono gwiazdy o ID: " + dto.getGwiazdaId())));
        }

        if (dto.getGalaktykaId() != null) {
            planeta.setGalaktyka(galaktykaRepository.findById(dto.getGalaktykaId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono galaktyki o ID: " + dto.getGalaktykaId())));
        }

        if (dto.getUtworzylUsername() != null) {
            Uzytkownik user = uzytkownikRepository.findByUsername(dto.getUtworzylUsername()).orElse(null);
            if (user != null) {
                planeta.setUtworzyl(user);
            }
        }

        Planeta saved = planetaRepository.save(planeta);
        PlanetaDTO savedDto = PlanetaMapper.toDto(saved);

        if (saved.getUtworzyl() != null) {
            savedDto.setUtworzylUsername(saved.getUtworzyl().getUsername());
        }

        return EntityModel.of(savedDto,
                linkTo(methodOn(PlanetaController.class).getById(saved.getId())).withSelfRel());
    }

    // ==============================
    // UPDATE
    // ==============================
    @PutMapping("/{id}")
    public EntityModel<PlanetaDTO> update(@PathVariable Integer id, @RequestBody PlanetaDTO dto, @RequestParam String username) {
        Planeta planeta = planetaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono planety o ID: " + id));

        if (dto.getGwiazdaId() != null) {
            planeta.setGwiazda(gwiazdaRepository.findById(dto.getGwiazdaId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono gwiazdy o ID: " + dto.getGwiazdaId())));
        }

        if (dto.getGalaktykaId() != null) {
            planeta.setGalaktyka(galaktykaRepository.findById(dto.getGalaktykaId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono galaktyki o ID: " + dto.getGalaktykaId())));
        }

        boolean isAdmin = uzytkownikRepository.findByUsername(username)
                .map(u -> u.getRole().stream().anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN")))
                .orElse(false);

        String autor = (planeta.getUtworzyl() != null) ? planeta.getUtworzyl().getUsername() : null;
        if (!isAdmin && (autor == null || !autor.equals(username))) {
            throw new RuntimeException("Brak uprawnień do edycji tej planety!");
        }

        planeta.setNazwa(dto.getNazwa());
        planeta.setMasa(dto.getMasa());
        planeta.setPromien(dto.getPromien());
        planeta.setMaAtmosfere(dto.getMaAtmosfere());
        planeta.setOdlegloscOdGwiazdy(dto.getOdlegloscOdGwiazdy());

        Planeta updated = planetaRepository.save(planeta);
        PlanetaDTO updatedDto = PlanetaMapper.toDto(updated);

        return EntityModel.of(updatedDto,
                linkTo(methodOn(PlanetaController.class).getById(updated.getId())).withSelfRel());
    }

    // ==============================
    // DELETE
    // ==============================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id, @RequestParam String username) {
        Planeta planeta = planetaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono planety o ID: " + id));

        boolean isAdmin = uzytkownikRepository.findByUsername(username)
                .map(u -> u.getRole().stream().anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN")))
                .orElse(false);

        String autor = (planeta.getUtworzyl() != null) ? planeta.getUtworzyl().getUsername() : null;
        if (!isAdmin && (autor == null || !autor.equals(username))) {
            throw new RuntimeException("Brak uprawnień do usunięcia tej planety!");
        }

        planetaRepository.delete(planeta);
    }

    // ==============================
    // FILTRY
    // ==============================
    @GetMapping("/filter")
    public CollectionModel<EntityModel<PlanetaDTO>> filterPlanety(
            @RequestParam(required = false) String nazwa,
            @RequestParam(required = false) Double masaMin,
            @RequestParam(required = false) Double masaMax,
            @RequestParam(required = false) Double promienMin,
            @RequestParam(required = false) Double promienMax,
            @RequestParam(required = false) Boolean maAtmosfere,
            @RequestParam(required = false) Double odlegloscMin,
            @RequestParam(required = false) Double odlegloscMax,
            @RequestParam(required = false) Integer gwiazdaId,
            @RequestParam(required = false) Integer galaktykaId
    ) {
        Specification<Planeta> spec = (root, query, cb) -> {
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

            if (promienMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("promien"), promienMin));
            }

            if (promienMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("promien"), promienMax));
            }

            if (maAtmosfere != null) {
                predicates.add(cb.equal(root.get("maAtmosfere"), maAtmosfere));
            }

            if (odlegloscMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("odlegloscOdGwiazdy"), odlegloscMin));
            }

            if (odlegloscMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("odlegloscOdGwiazdy"), odlegloscMax));
            }

            if (gwiazdaId != null) {
                predicates.add(cb.equal(root.get("gwiazda").get("id"), gwiazdaId));
            }

            if (galaktykaId != null) {
                predicates.add(cb.equal(root.get("galaktyka").get("id"), galaktykaId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<EntityModel<PlanetaDTO>> wynik = planetaRepository.findAll(spec).stream()
                .map(PlanetaMapper::toDto)
                .map(dto -> EntityModel.of(dto,
                        linkTo(methodOn(PlanetaController.class)
                                .getById(dto.getId())).withSelfRel()))
                .toList();

        return CollectionModel.of(wynik);
    }
 // ==============================
 // SORTOWANIE
 // ==============================
 @GetMapping("/sort")
 public CollectionModel<EntityModel<PlanetaDTO>> sortPlanety(
         @RequestParam String by,
         @RequestParam(defaultValue = "asc") String dir
 ) {
     List<Planeta> planety = planetaRepository.findAll();

     boolean asc = dir.equalsIgnoreCase("asc");

     switch (by.toLowerCase()) {
         case "nazwa":
             planety.sort((a, b) -> asc
                     ? a.getNazwa().compareToIgnoreCase(b.getNazwa())
                     : b.getNazwa().compareToIgnoreCase(a.getNazwa()));
             break;

         case "masa":
             planety.sort((a, b) -> asc
                     ? Double.compare(a.getMasa(), b.getMasa())
                     : Double.compare(b.getMasa(), a.getMasa()));
             break;

         case "promien":
             planety.sort((a, b) -> asc
                     ? Double.compare(a.getPromien(), b.getPromien())
                     : Double.compare(b.getPromien(), a.getPromien()));
             break;

         case "odleglosc":
             planety.sort((a, b) -> asc
                     ? Double.compare(a.getOdlegloscOdGwiazdy(), b.getOdlegloscOdGwiazdy())
                     : Double.compare(b.getOdlegloscOdGwiazdy(), a.getOdlegloscOdGwiazdy()));
             break;

         case "atmosfera":
             planety.sort((a, b) -> asc
                     ? Boolean.compare(a.getMaAtmosfere(), b.getMaAtmosfere())
                     : Boolean.compare(b.getMaAtmosfere(), a.getMaAtmosfere()));
             break;

         default:
             throw new RuntimeException("Nieznany parametr sortowania: " + by);
     }

     List<EntityModel<PlanetaDTO>> wynik = planety.stream()
             .map(PlanetaMapper::toDto)
             .map(dto -> EntityModel.of(dto,
                     linkTo(methodOn(PlanetaController.class).getById(dto.getId())).withSelfRel()))
             .collect(Collectors.toList());

     return CollectionModel.of(wynik,
             linkTo(methodOn(PlanetaController.class).sortPlanety(by, dir)).withSelfRel());
 }
}
