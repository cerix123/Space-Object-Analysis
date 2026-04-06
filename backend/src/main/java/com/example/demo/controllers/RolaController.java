package com.example.demo.controllers;

import com.example.demo.Rola;
import com.example.demo.dto.RolaDTO;
import com.example.demo.mappers.RolaMapper;
import com.example.demo.repositories.RolaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/role")
public class RolaController {

    @Autowired
    private RolaRepository rolaRepository;

    @GetMapping
    public CollectionModel<EntityModel<RolaDTO>> getAll() {
        List<EntityModel<RolaDTO>> role = rolaRepository.findAll().stream()
                .map(RolaMapper::toDto)
                .map(dto -> EntityModel.of(dto,
                        linkTo(methodOn(RolaController.class).getById(dto.getId())).withSelfRel()))
                .collect(Collectors.toList());

        return CollectionModel.of(role, linkTo(methodOn(RolaController.class).getAll()).withSelfRel());
    }

    @GetMapping("/{id}")
    public EntityModel<RolaDTO> getById(@PathVariable Integer id) {
        Rola rola = rolaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono roli o ID: " + id));

        RolaDTO dto = RolaMapper.toDto(rola);
        return EntityModel.of(dto,
                linkTo(methodOn(RolaController.class).getById(id)).withSelfRel(),
                linkTo(methodOn(RolaController.class).getAll()).withRel("wszystkie"));
    }

    @PostMapping
    public EntityModel<RolaDTO> create(@RequestBody RolaDTO dto) {
        Rola rola = RolaMapper.toEntity(dto);
        Rola saved = rolaRepository.save(rola);
        return EntityModel.of(RolaMapper.toDto(saved),
                linkTo(methodOn(RolaController.class).getById(saved.getId())).withSelfRel());
    }

    @PutMapping("/{id}")
    public EntityModel<RolaDTO> update(@PathVariable Integer id, @RequestBody RolaDTO dto) {
        Rola rola = rolaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono roli o ID: " + id));
        rola.setNazwa(dto.getNazwa());
        Rola updated = rolaRepository.save(rola);
        return EntityModel.of(RolaMapper.toDto(updated),
                linkTo(methodOn(RolaController.class).getById(updated.getId())).withSelfRel());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        rolaRepository.deleteById(id);
    }
}
