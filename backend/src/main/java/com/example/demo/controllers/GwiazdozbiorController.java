package com.example.demo.controllers;

import com.example.demo.Gwiazdozbior;
import com.example.demo.Galaktyka;
import com.example.demo.dto.GwiazdozbiorDTO;
import com.example.demo.mappers.GwiazdozbiorMapper;
import com.example.demo.repositories.GwiazdozbiorRepository;
import com.example.demo.repositories.UzytkownikRepository;

import jakarta.persistence.criteria.Predicate;

import com.example.demo.repositories.GalaktykaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/gwiazdozbiory")
public class GwiazdozbiorController {

    @Autowired
    private GwiazdozbiorRepository gwiazdozbiorRepository;

    @Autowired
    private GalaktykaRepository galaktykaRepository;

    @Autowired
    private UzytkownikRepository uzytkownikRepository;
    
    // --- GET ---
    @GetMapping
    public CollectionModel<EntityModel<GwiazdozbiorDTO>> getAll() {
        List<EntityModel<GwiazdozbiorDTO>> gwiazdozbiory = gwiazdozbiorRepository.findAll()
                .stream()
                .map(GwiazdozbiorMapper::toDTO)
                .map(dto -> EntityModel.of(dto,
                        linkTo(methodOn(GwiazdozbiorController.class).getById(dto.getId())).withSelfRel(),
                        linkTo(methodOn(GwiazdozbiorController.class).getAll()).withRel("gwiazdozbiory")
                ))
                .collect(Collectors.toList());

        return CollectionModel.of(gwiazdozbiory,
                linkTo(methodOn(GwiazdozbiorController.class).getAll()).withSelfRel());
    }

    // --- GET: Po ID ---
    @GetMapping("/{id}")
    public EntityModel<GwiazdozbiorDTO> getById(@PathVariable Integer id) {
        Gwiazdozbior gwiazdozbior = gwiazdozbiorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gwiazdozbiór o ID " + id + " nie istnieje"));

        GwiazdozbiorDTO dto = GwiazdozbiorMapper.toDTO(gwiazdozbior);
        return EntityModel.of(dto,
                linkTo(methodOn(GwiazdozbiorController.class).getById(id)).withSelfRel(),
                linkTo(methodOn(GwiazdozbiorController.class).getAll()).withRel("gwiazdozbiory"));
    }

    @PostMapping
    public EntityModel<GwiazdozbiorDTO> create(@RequestBody GwiazdozbiorDTO dto) {
        Gwiazdozbior gwiazdozbior = GwiazdozbiorMapper.toEntity(dto);

        if (dto.getGalaktykaId() != null) {
            Galaktyka galaktyka = galaktykaRepository.findById(dto.getGalaktykaId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono galaktyki o ID " + dto.getGalaktykaId()));
            gwiazdozbior.setGalaktyka(galaktyka);
        }

        if (dto.getUtworzylUsername() != null) {
            uzytkownikRepository.findByUsername(dto.getUtworzylUsername())
                    .ifPresent(gwiazdozbior::setUtworzyl);
        }

        Gwiazdozbior saved = gwiazdozbiorRepository.save(gwiazdozbior);
        GwiazdozbiorDTO resultDTO = GwiazdozbiorMapper.toDTO(saved);

        return EntityModel.of(resultDTO,
                linkTo(methodOn(GwiazdozbiorController.class).getById(resultDTO.getId())).withSelfRel(),
                linkTo(methodOn(GwiazdozbiorController.class).getAll()).withRel("gwiazdozbiory"));
    }

    // --- PUT---
    @PutMapping("/{id}")
    public EntityModel<GwiazdozbiorDTO> update(@PathVariable Integer id,
                                               @RequestBody GwiazdozbiorDTO dto,
                                               @RequestParam String username) {
        Gwiazdozbior existing = gwiazdozbiorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono gwiazdozbioru o ID " + id));

        boolean isAdmin = uzytkownikRepository.findByUsername(username)
                .map(u -> u.getRole().stream().anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN")))
                .orElse(false);

        String autor = (existing.getUtworzyl() != null) ? existing.getUtworzyl().getUsername() : null;
        if (!isAdmin && (autor == null || !autor.equals(username))) {
            throw new RuntimeException("Brak uprawnień do edycji tego gwiazdozbioru!");
        }

        existing.setNazwa(dto.getNazwa());
        existing.setOpis(dto.getOpis());
        existing.setCreatedAt(dto.getCreatedAt());

        if (dto.getGalaktykaId() != null) {
            Galaktyka galaktyka = galaktykaRepository.findById(dto.getGalaktykaId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono galaktyki o ID " + dto.getGalaktykaId()));
            existing.setGalaktyka(galaktyka);
        }

        Gwiazdozbior updated = gwiazdozbiorRepository.save(existing);
        GwiazdozbiorDTO resultDTO = GwiazdozbiorMapper.toDTO(updated);

        return EntityModel.of(resultDTO,
                linkTo(methodOn(GwiazdozbiorController.class).getById(resultDTO.getId())).withSelfRel(),
                linkTo(methodOn(GwiazdozbiorController.class).getAll()).withRel("gwiazdozbiory"));
    }

    // --- DELETE:
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id, @RequestParam String username) {
        Gwiazdozbior gwiazdozbior = gwiazdozbiorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono gwiazdozbioru o ID " + id));

        boolean isAdmin = uzytkownikRepository.findByUsername(username)
                .map(u -> u.getRole().stream().anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN")))
                .orElse(false);

        String autor = (gwiazdozbior.getUtworzyl() != null) ? gwiazdozbior.getUtworzyl().getUsername() : null;
        if (!isAdmin && (autor == null || !autor.equals(username))) {
            throw new RuntimeException("Brak uprawnień do usunięcia tego gwiazdozbioru!");
        }

        gwiazdozbiorRepository.delete(gwiazdozbior);
    }
    
    @GetMapping("/filter")
    public CollectionModel<EntityModel<GwiazdozbiorDTO>> filterGwiazdozbiory(
            @RequestParam(required = false) String nazwa,
            @RequestParam(required = false) Integer galaktykaId,
            @RequestParam(required = false) Integer utworzylId,
            @RequestParam(required = false) Integer minGwiazdy,
            @RequestParam(required = false) Integer maxGwiazdy
    ) {
        Specification<Gwiazdozbior> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (nazwa != null) {
                predicates.add(cb.like(cb.lower(root.get("nazwa")), "%" + nazwa.toLowerCase() + "%"));
            }

            if (galaktykaId != null) {
                predicates.add(cb.equal(root.get("galaktyka").get("id"), galaktykaId));
            }

            if (utworzylId != null) {
                predicates.add(cb.equal(root.get("utworzyl").get("id"), utworzylId));
            }

            if (minGwiazdy != null) {
                predicates.add(cb.greaterThanOrEqualTo(cb.size(root.get("gwiazdy")), minGwiazdy));
            }

            if (maxGwiazdy != null) {
                predicates.add(cb.lessThanOrEqualTo(cb.size(root.get("gwiazdy")), maxGwiazdy));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<EntityModel<GwiazdozbiorDTO>> wynik = gwiazdozbiorRepository.findAll(spec).stream()
                .map(GwiazdozbiorMapper::toDTO)
                .map(dto -> EntityModel.of(dto,
                        linkTo(methodOn(GwiazdozbiorController.class)
                                .getById(dto.getId())).withSelfRel()))
                .toList();

        return CollectionModel.of(wynik);
    }
    @GetMapping("/sort")
    public List<GwiazdozbiorDTO> sortGwiazdozbiory(
            @RequestParam String field,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        List<GwiazdozbiorDTO> lista = gwiazdozbiorRepository.findAll()
                .stream()
                .map(GwiazdozbiorMapper::toDTO)
                .collect(Collectors.toList());

        Comparator<GwiazdozbiorDTO> comparator;

        switch (field) {
            case "id":
                comparator = Comparator.comparing(GwiazdozbiorDTO::getId);
                break;

            case "nazwa":
                comparator = Comparator.comparing(
                        GwiazdozbiorDTO::getNazwa,
                        Comparator.nullsLast(String::compareToIgnoreCase)
                );
                break;

            default:
                throw new RuntimeException("Nieznane pole sortowania: " + field);
        }

        if ("desc".equalsIgnoreCase(direction)) {
            comparator = comparator.reversed();
        }

        lista.sort(comparator);
        return lista;
    }

}
