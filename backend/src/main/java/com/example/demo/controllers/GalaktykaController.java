package com.example.demo.controllers;

import com.example.demo.Galaktyka;
import com.example.demo.Uzytkownik;
import com.example.demo.dto.GalaktykaDTO;
import com.example.demo.exceptions.GlobalExceptionHandler;
import com.example.demo.mappers.GalaktykaMapper;
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
@RequestMapping("/galaktyki")
public class GalaktykaController {

    @Autowired
    private GalaktykaRepository repo;

    @Autowired
    private UzytkownikRepository uzytkownikRepository;
    
    @PostMapping("/add")
    public ResponseEntity<?> dodajGalaktyke(@RequestBody Map<String, Object> body) {
        try {
            String nazwa = (String) body.get("nazwa");
            String typ = (String) body.get("typ");
            Long srednica = body.get("srednica") != null ? Long.valueOf(body.get("srednica").toString()) : null;
            Long liczbaGwiazd = body.get("liczbaGwiazd") != null ? Long.valueOf(body.get("liczbaGwiazd").toString()) : null;
            String usernameUtworzyl = (String) body.get("usernameUtworzyl");

            Galaktyka g = new Galaktyka();
            g.setNazwa(nazwa);
            g.setTyp(typ);
            g.setSrednica(srednica);
            g.setLiczbaGwiazd(liczbaGwiazd);

            if (usernameUtworzyl != null && !usernameUtworzyl.isBlank()) {
                Uzytkownik u = uzytkownikRepository.findByUsername(usernameUtworzyl).orElse(null);
                if (u != null) {
                    g.setUtworzyl(u);
                }
            }

            Galaktyka saved = repo.save(g);
            return ResponseEntity.ok(" Dodano galaktykę o ID=" + saved.getId() + " przez " + usernameUtworzyl);

        } catch (Exception e) {
            return ResponseEntity.ok(new GlobalExceptionHandler.ErrorResponse(true, " Błąd: " + e.getMessage()));
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> edytujGalaktyke(@PathVariable Integer id, @RequestBody GalaktykaDTO dto, @RequestParam String username) {
        Galaktyka g = repo.findById(id).orElseThrow(() -> new RuntimeException("Nie znaleziono galaktyki o ID: " + id));

        boolean isAdmin = uzytkownikRepository.findByUsername(username)
                .map(u -> u.getRole().stream().anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN")))
                .orElse(false);

        String autor = g.getUtworzyl() != null ? g.getUtworzyl().getUsername() : null;
        if (!isAdmin && (autor == null || !autor.equals(username))) {
            throw new RuntimeException("Brak uprawnień do edycji tej galaktyki!");
        }

        g.setNazwa(dto.getNazwa());
        g.setTyp(dto.getTyp());
        g.setSrednica(dto.getSrednica());
        g.setLiczbaGwiazd(dto.getLiczbaGwiazd());

        Galaktyka updated = repo.save(g);
        GalaktykaDTO updatedDto = GalaktykaMapper.toDto(updated);

        return ResponseEntity.ok(updatedDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> usunGalaktyke(@PathVariable Integer id, @RequestParam String username) {
        Galaktyka g = repo.findById(id).orElseThrow(() -> new RuntimeException("Nie znaleziono galaktyki o ID: " + id));

        boolean isAdmin = uzytkownikRepository.findByUsername(username)
                .map(u -> u.getRole().stream().anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN")))
                .orElse(false);

        String autor = g.getUtworzyl() != null ? g.getUtworzyl().getUsername() : null;
        if (!isAdmin && (autor == null || !autor.equals(username))) {
            throw new RuntimeException("Brak uprawnień do usunięcia tej galaktyki!");
        }

        repo.delete(g);
        return ResponseEntity.ok("Usunięto galaktykę o ID: " + id);
    }

    // Pobierz wszystkie galaktyki
    @GetMapping
    public ResponseEntity<?> wszystkieGalaktyki() {
        try {
            List<GalaktykaDTO> lista = repo.findAll()
                .stream()
                .map(GalaktykaMapper::toDto)
                .collect(Collectors.toList());

            return ResponseEntity.ok(CollectionModel.of(lista,
                linkTo(methodOn(GalaktykaController.class).wszystkieGalaktyki()).withSelfRel()));
        } catch (Exception e) {
            return ResponseEntity.ok(new GlobalExceptionHandler.ErrorResponse(true, e.getMessage()));
        }
    }

    @GetMapping("/filter")
    public CollectionModel<EntityModel<GalaktykaDTO>> filterGalaktyki(
            @RequestParam(required = false) String nazwa,
            @RequestParam(required = false) String typ,
            @RequestParam(required = false) Long srednicaMin,
            @RequestParam(required = false) Long srednicaMax,
            @RequestParam(required = false) Long gwiazdyMin,
            @RequestParam(required = false) Long gwiazdyMax,
            @RequestParam(required = false) Integer utworzylId
    ) {
        Specification<Galaktyka> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (nazwa != null) {
                predicates.add(cb.like(cb.lower(root.get("nazwa")), "%" + nazwa.toLowerCase() + "%"));
            }

            if (typ != null) {
                predicates.add(cb.like(cb.lower(root.get("typ")), "%" + typ.toLowerCase() + "%"));
            }

            if (srednicaMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("srednica"), srednicaMin));
            }

            if (srednicaMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("srednica"), srednicaMax));
            }

            if (gwiazdyMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("liczbaGwiazd"), gwiazdyMin));
            }

            if (gwiazdyMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("liczbaGwiazd"), gwiazdyMax));
            }

            if (utworzylId != null) {
                predicates.add(cb.equal(root.get("utworzyl").get("id"), utworzylId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<EntityModel<GalaktykaDTO>> wynik = repo.findAll(spec).stream()
                .map(GalaktykaMapper::toDto)
                .map(dto -> EntityModel.of(dto,
                        linkTo(methodOn(GalaktykaController.class)
                                .szczegolyGalaktyki(dto.getId())).withSelfRel()))
                .toList();

        return CollectionModel.of(wynik);
    }



    // Szczegóły galaktyki
    @GetMapping("/{id}")
    public ResponseEntity<?> szczegolyGalaktyki(@PathVariable int id) {
        try {
            Optional<GalaktykaDTO> opt = repo.findById(id).map(GalaktykaMapper::toDto);
            if (opt.isPresent()) {
                return ResponseEntity.ok(opt.get());
            } else {
                return ResponseEntity.ok(new GlobalExceptionHandler.ErrorResponse(true, "Nie znaleziono galaktyki."));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(new GlobalExceptionHandler.ErrorResponse(true, e.getMessage()));
        }
    }
    @GetMapping("/sort")
    public ResponseEntity<?> sortGalaktyki(
            @RequestParam String field,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        List<GalaktykaDTO> lista = repo.findAll()
                .stream()
                .map(GalaktykaMapper::toDto)
                .collect(Collectors.toList());

        Comparator<GalaktykaDTO> comparator;

        switch (field) {
            case "nazwa":
                comparator = Comparator.comparing(GalaktykaDTO::getNazwa, Comparator.nullsLast(String::compareToIgnoreCase));
                break;
            case "typ":
                comparator = Comparator.comparing(GalaktykaDTO::getTyp, Comparator.nullsLast(String::compareToIgnoreCase));
                break;
            case "srednica":
                comparator = Comparator.comparing(GalaktykaDTO::getSrednica, Comparator.nullsLast(Long::compareTo));
                break;
            case "liczbaGwiazd":
                comparator = Comparator.comparing(GalaktykaDTO::getLiczbaGwiazd, Comparator.nullsLast(Long::compareTo));
                break;
            case "id":
                comparator = Comparator.comparing(GalaktykaDTO::getId);
                break;
            default:
                return ResponseEntity.badRequest().body("Nieznane pole sortowania!");
        }

        if ("desc".equalsIgnoreCase(direction)) {
            comparator = comparator.reversed();
        }

        lista.sort(comparator);

        return ResponseEntity.ok(lista);
    }

}
