package com.example.demo.controllers;

import com.example.demo.CzarnaDziura;
import com.example.demo.Galaktyka;
import com.example.demo.Uzytkownik;
import com.example.demo.dto.CzarnaDziuraDTO;
import com.example.demo.mappers.CzarnaDziuraMapper;
import com.example.demo.repositories.CzarnaDziuraRepository;
import com.example.demo.repositories.GalaktykaRepository;
import com.example.demo.repositories.UzytkownikRepository;

import jakarta.persistence.criteria.Predicate;

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
@RequestMapping("/api/czarne-dziury")
public class CzarnaDziuraController {

    @Autowired
    private CzarnaDziuraRepository dziuraRepository;

    @Autowired
    private GalaktykaRepository galaktykaRepository;

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @GetMapping
    public CollectionModel<EntityModel<CzarnaDziuraDTO>> getAll() {
        List<EntityModel<CzarnaDziuraDTO>> list = dziuraRepository.findAll().stream()
                .map(CzarnaDziuraMapper::toDto)
                .map(dto -> EntityModel.of(dto,
                        linkTo(methodOn(CzarnaDziuraController.class).getById(dto.getId())).withSelfRel()))
                .collect(Collectors.toList());
        return CollectionModel.of(list, linkTo(methodOn(CzarnaDziuraController.class).getAll()).withSelfRel());
    }

    @GetMapping("/{id}")
    public EntityModel<CzarnaDziuraDTO> getById(@PathVariable Integer id) {
        CzarnaDziura dziura = dziuraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono czarnej dziury o ID: " + id));
        CzarnaDziuraDTO dto = CzarnaDziuraMapper.toDto(dziura);
        return EntityModel.of(dto,
                linkTo(methodOn(CzarnaDziuraController.class).getById(id)).withSelfRel(),
                linkTo(methodOn(CzarnaDziuraController.class).getAll()).withRel("wszystkie"));
    }

    @PostMapping
    public EntityModel<CzarnaDziuraDTO> create(@RequestBody CzarnaDziuraDTO dto) {
        CzarnaDziura dziura = CzarnaDziuraMapper.toEntity(dto);

        if (dto.getGalaktykaId() != null) {
            dziura.setGalaktyka(galaktykaRepository.findById(dto.getGalaktykaId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono galaktyki o ID: " + dto.getGalaktykaId())));
        }

        if (dto.getUtworzylUsername() != null) {
            Uzytkownik user = uzytkownikRepository.findByUsername(dto.getUtworzylUsername()).orElse(null);
            if (user != null) dziura.setUtworzyl(user);
        }

        CzarnaDziura saved = dziuraRepository.save(dziura);
        CzarnaDziuraDTO savedDto = CzarnaDziuraMapper.toDto(saved);

        return EntityModel.of(savedDto,
                linkTo(methodOn(CzarnaDziuraController.class).getById(saved.getId())).withSelfRel());
    }

    @PutMapping("/{id}")
    public EntityModel<CzarnaDziuraDTO> update(@PathVariable Integer id, @RequestBody CzarnaDziuraDTO dto, @RequestParam String username) {
        CzarnaDziura dziura = dziuraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono czarnej dziury o ID: " + id));

        if (dto.getGalaktykaId() != null) {
            dziura.setGalaktyka(galaktykaRepository.findById(dto.getGalaktykaId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono galaktyki o ID: " + dto.getGalaktykaId())));
        }

        boolean isAdmin = uzytkownikRepository.findByUsername(username)
                .map(u -> u.getRole().stream().anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN")))
                .orElse(false);

        String autor = dziura.getUtworzyl() != null ? dziura.getUtworzyl().getUsername() : null;
        if (!isAdmin && (autor == null || !autor.equals(username))) {
            throw new RuntimeException("Brak uprawnień do edycji tej czarnej dziury!");
        }

        dziura.setNazwa(dto.getNazwa());
        dziura.setMasa(dto.getMasa());
        dziura.setPromienSchwarzschilda(dto.getPromienSchwarzschilda());
        dziura.setTyp(dto.getTyp());

        CzarnaDziura updated = dziuraRepository.save(dziura);
        CzarnaDziuraDTO updatedDto = CzarnaDziuraMapper.toDto(updated);

        return EntityModel.of(updatedDto,
                linkTo(methodOn(CzarnaDziuraController.class).getById(updated.getId())).withSelfRel());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id, @RequestParam String username) {
        CzarnaDziura dziura = dziuraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono czarnej dziury o ID: " + id));

        boolean isAdmin = uzytkownikRepository.findByUsername(username)
                .map(u -> u.getRole().stream().anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN")))
                .orElse(false);

        String autor = dziura.getUtworzyl() != null ? dziura.getUtworzyl().getUsername() : null;
        if (!isAdmin && (autor == null || !autor.equals(username))) {
            throw new RuntimeException("Brak uprawnień do usunięcia tej czarnej dziury!");
        }

        dziuraRepository.delete(dziura);
    }

    @GetMapping("/filter")
    public CollectionModel<EntityModel<CzarnaDziuraDTO>> filterCzarneDziury(
            @RequestParam(required = false) String nazwa,
            @RequestParam(required = false) Double masaMin,
            @RequestParam(required = false) Double masaMax,
            @RequestParam(required = false) Double promienMin,
            @RequestParam(required = false) Double promienMax,
            @RequestParam(required = false) String typ,
            @RequestParam(required = false) Integer galaktykaId
    ) {
        Specification<CzarnaDziura> spec = (root, query, cb) -> {
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
                predicates.add(cb.greaterThanOrEqualTo(root.get("promienSchwarzschilda"), promienMin));
            }

            if (promienMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("promienSchwarzschilda"), promienMax));
            }

            if (typ != null) {
                predicates.add(cb.like(cb.lower(root.get("typ")), "%" + typ.toLowerCase() + "%"));
            }

            if (galaktykaId != null) {
                predicates.add(cb.equal(root.get("galaktyka").get("id"), galaktykaId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<EntityModel<CzarnaDziuraDTO>> wynik = dziuraRepository.findAll(spec).stream()
                .map(CzarnaDziuraMapper::toDto)
                .map(dto -> EntityModel.of(dto,
                        linkTo(methodOn(CzarnaDziuraController.class)
                                .getById(dto.getId())).withSelfRel()))
                .toList();

        return CollectionModel.of(wynik);
    }
 // SORTOWANIE
    @GetMapping("/sort")
    public CollectionModel<EntityModel<CzarnaDziuraDTO>> sortCzarneDziury(
            @RequestParam String by,
            @RequestParam(defaultValue = "asc") String order
    ) {
        List<CzarnaDziura> dziury = dziuraRepository.findAll();

        Comparator<CzarnaDziura> comparator;

        switch (by.toLowerCase()) {
            case "id":
                comparator = Comparator.comparing(CzarnaDziura::getId);
                break;
            case "nazwa":
                comparator = Comparator.comparing(
                        CzarnaDziura::getNazwa,
                        String.CASE_INSENSITIVE_ORDER
                );
                break;
            case "masa":
                comparator = Comparator.comparing(
                        d -> d.getMasa() != null ? d.getMasa() : Double.MIN_VALUE
                );
                break;
            case "promienschwarzschilda":
                comparator = Comparator.comparing(
                        d -> d.getPromienSchwarzschilda() != null ? d.getPromienSchwarzschilda() : Double.MIN_VALUE
                );
                break;
            case "typ":
                comparator = Comparator.comparing(
                        d -> d.getTyp() != null ? d.getTyp().toLowerCase() : ""
                );
                break;
            default:
                throw new RuntimeException("Nieznane pole sortowania: " + by);
        }

        if (order.equalsIgnoreCase("desc")) comparator = comparator.reversed();

        List<EntityModel<CzarnaDziuraDTO>> wynik = dziury.stream()
                .sorted(comparator)
                .map(CzarnaDziuraMapper::toDto)
                .map(dto -> EntityModel.of(dto,
                        linkTo(methodOn(CzarnaDziuraController.class).getById(dto.getId())).withSelfRel()))
                .collect(Collectors.toList());

        return CollectionModel.of(wynik);
    }

}
