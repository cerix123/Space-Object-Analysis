package com.example.demo.controllers;

import com.example.demo.Galaktyka;
import com.example.demo.Ksiezyc;
import com.example.demo.Planeta;
import com.example.demo.dto.KsiezycDTO;
import com.example.demo.mappers.KsiezycMapper;
import com.example.demo.repositories.GalaktykaRepository;
import com.example.demo.repositories.KsiezycRepository;
import com.example.demo.repositories.PlanetaRepository;
import com.example.demo.repositories.UzytkownikRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/ksiezyce")
public class KsiezycController {

    @Autowired
    private KsiezycRepository ksiezycRepository;
    @Autowired
    private PlanetaRepository planetaRepository;
    @Autowired
    private GalaktykaRepository galaktykaRepository;
    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    // GET ALL
    @GetMapping
    public CollectionModel<EntityModel<KsiezycDTO>> getAll() {
        List<EntityModel<KsiezycDTO>> ksiezyce = ksiezycRepository.findAll().stream()
                .map(KsiezycMapper::toDTO)
                .map(dto -> EntityModel.of(dto,
                        linkTo(methodOn(KsiezycController.class).getById(dto.getId())).withSelfRel()))
                .collect(Collectors.toList());

        return CollectionModel.of(ksiezyce, linkTo(methodOn(KsiezycController.class).getAll()).withSelfRel());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public EntityModel<KsiezycDTO> getById(@PathVariable Integer id) {
        Ksiezyc ksiezyc = ksiezycRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono księżyca o ID: " + id));

        KsiezycDTO dto = KsiezycMapper.toDTO(ksiezyc);
        return EntityModel.of(dto,
                linkTo(methodOn(KsiezycController.class).getById(id)).withSelfRel(),
                linkTo(methodOn(KsiezycController.class).getAll()).withRel("wszystkie"));
    }

    // CREATE
    @PostMapping
    public EntityModel<KsiezycDTO> create(@RequestBody KsiezycDTO dto) {
        Ksiezyc ksiezyc = KsiezycMapper.toEntity(dto);

        if (dto.getPlanetaId() != null) {
            Planeta planeta = planetaRepository.findById(dto.getPlanetaId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono planety o ID " + dto.getPlanetaId()));
            ksiezyc.setPlaneta(planeta);
        }

        if (dto.getGalaktykaId() != null) {
            Galaktyka galaktyka = galaktykaRepository.findById(dto.getGalaktykaId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono galaktyki o ID " + dto.getGalaktykaId()));
            ksiezyc.setGalaktyka(galaktyka);
        }

        if (dto.getUtworzylUsername() != null) {
            uzytkownikRepository.findByUsername(dto.getUtworzylUsername())
                    .ifPresent(ksiezyc::setUtworzyl);
        }

        Ksiezyc saved = ksiezycRepository.save(ksiezyc);
        KsiezycDTO resultDTO = KsiezycMapper.toDTO(saved);

        return EntityModel.of(
                resultDTO,
                linkTo(methodOn(KsiezycController.class).getById(resultDTO.getId())).withSelfRel(),
                linkTo(methodOn(KsiezycController.class).getAll()).withRel("ksiezyce")
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public EntityModel<KsiezycDTO> update(@PathVariable Integer id,
                                          @RequestBody KsiezycDTO dto,
                                          @RequestParam String username) {
        Ksiezyc ksiezyc = ksiezycRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono księżyca o ID: " + id));

        if (dto.getPlanetaId() != null) {
            Planeta planeta = planetaRepository.findById(dto.getPlanetaId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono planety o ID: " + dto.getPlanetaId()));
            ksiezyc.setPlaneta(planeta);
        }

        if (dto.getGalaktykaId() != null) {
            Galaktyka galaktyka = galaktykaRepository.findById(dto.getGalaktykaId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono galaktyki o ID: " + dto.getGalaktykaId()));
            ksiezyc.setGalaktyka(galaktyka);
        }

        boolean isAdmin = uzytkownikRepository.findByUsername(username)
                .map(u -> u.getRole().stream().anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN")))
                .orElse(false);

        String autor = (ksiezyc.getUtworzyl() != null) ? ksiezyc.getUtworzyl().getUsername() : null;
        if (!isAdmin && (autor == null || !autor.equals(username))) {
            throw new RuntimeException("Brak uprawnień do edycji tego księżyca!");
        }

        ksiezyc.setNazwa(dto.getNazwa());
        ksiezyc.setMasa(dto.getMasa());
        ksiezyc.setPromien(dto.getPromien());
        ksiezyc.setOdlegloscOdPlanety(dto.getOdlegloscOdPlanety());

        Ksiezyc updated = ksiezycRepository.save(ksiezyc);
        KsiezycDTO updatedDto = KsiezycMapper.toDTO(updated);

        return EntityModel.of(updatedDto,
                linkTo(methodOn(KsiezycController.class).getById(updated.getId())).withSelfRel());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id, @RequestParam String username) {
        Ksiezyc ksiezyc = ksiezycRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono księżyca o ID: " + id));

        boolean isAdmin = uzytkownikRepository.findByUsername(username)
                .map(u -> u.getRole().stream().anyMatch(r -> r.getNazwa().equalsIgnoreCase("ADMIN")))
                .orElse(false);

        String autor = (ksiezyc.getUtworzyl() != null) ? ksiezyc.getUtworzyl().getUsername() : null;
        if (!isAdmin && (autor == null || !autor.equals(username))) {
            throw new RuntimeException("Brak uprawnień do usunięcia tego księżyca!");
        }

        ksiezycRepository.delete(ksiezyc);
    }

    // FILTERS
    @GetMapping("/filter")
    public CollectionModel<EntityModel<KsiezycDTO>> filterKsiezyce(
            @RequestParam(required = false) String nazwa,
            @RequestParam(required = false) Double masaMin,
            @RequestParam(required = false) Double masaMax,
            @RequestParam(required = false) Double promienMin,
            @RequestParam(required = false) Double promienMax,
            @RequestParam(required = false) Double odlegloscMin,
            @RequestParam(required = false) Double odlegloscMax,
            @RequestParam(required = false) Integer planetaId,
            @RequestParam(required = false) Integer galaktykaId,
            @RequestParam(required = false) Integer utworzylId
    ) {
        List<Ksiezyc> ksiezyce = ksiezycRepository.findAll();

        List<EntityModel<KsiezycDTO>> wynik = ksiezyce.stream()
                .filter(k -> nazwa == null || k.getNazwa().toLowerCase().contains(nazwa.toLowerCase()))
                .filter(k -> masaMin == null || (k.getMasa() != null && k.getMasa() >= masaMin))
                .filter(k -> masaMax == null || (k.getMasa() != null && k.getMasa() <= masaMax))
                .filter(k -> promienMin == null || (k.getPromien() != null && k.getPromien() >= promienMin))
                .filter(k -> promienMax == null || (k.getPromien() != null && k.getPromien() <= promienMax))
                .filter(k -> odlegloscMin == null || (k.getOdlegloscOdPlanety() != null && k.getOdlegloscOdPlanety() >= odlegloscMin))
                .filter(k -> odlegloscMax == null || (k.getOdlegloscOdPlanety() != null && k.getOdlegloscOdPlanety() <= odlegloscMax))
                .filter(k -> planetaId == null || (k.getPlaneta() != null && k.getPlaneta().getId().equals(planetaId)))
                .filter(k -> galaktykaId == null || (k.getGalaktyka() != null && k.getGalaktyka().getId().equals(galaktykaId)))
                .filter(k -> utworzylId == null || (k.getUtworzyl() != null && k.getUtworzyl().getId().equals(utworzylId)))
                .map(KsiezycMapper::toDTO)
                .map(dto -> EntityModel.of(dto,
                        linkTo(methodOn(KsiezycController.class).getById(dto.getId())).withSelfRel()))
                .collect(Collectors.toList());

        return CollectionModel.of(wynik);
    }
 // SORT
    @GetMapping("/sort")
    public CollectionModel<EntityModel<KsiezycDTO>> sortKsiezyce(
            @RequestParam String by,
            @RequestParam(defaultValue = "asc") String order
    ) {
        List<Ksiezyc> ksiezyce = ksiezycRepository.findAll();

        Comparator<Ksiezyc> comparator;

        switch (by.toLowerCase()) {
            case "id":
                comparator = Comparator.comparing(Ksiezyc::getId);
                break;
            case "nazwa":
                comparator = Comparator.comparing(Ksiezyc::getNazwa, String.CASE_INSENSITIVE_ORDER);
                break;
            case "masa":
                comparator = Comparator.comparing(
                        k -> k.getMasa() != null ? k.getMasa() : Double.MIN_VALUE
                );
                break;
            case "promien":
                comparator = Comparator.comparing(
                        k -> k.getPromien() != null ? k.getPromien() : Double.MIN_VALUE
                );
                break;
            case "odlegloscodplanety":
                comparator = Comparator.comparing(
                        k -> k.getOdlegloscOdPlanety() != null ? k.getOdlegloscOdPlanety() : Double.MIN_VALUE
                );
                break;
            default:
                throw new RuntimeException("Nieznane pole sortowania: " + by);
        }

        if (order.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }

        List<EntityModel<KsiezycDTO>> wynik = ksiezyce.stream()
                .sorted(comparator)
                .map(KsiezycMapper::toDTO)
                .map(dto -> EntityModel.of(dto,
                        linkTo(methodOn(KsiezycController.class).getById(dto.getId())).withSelfRel()))
                .collect(Collectors.toList());

        return CollectionModel.of(wynik);
    }

}
