package com.example.demo.repositories;

import com.example.demo.CzarnaDziura;
import com.example.demo.Planeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanetaRepository extends JpaRepository<Planeta, Integer>, JpaSpecificationExecutor<Planeta> {


    List<Planeta> findByNazwa(String nazwa);

    List<Planeta> findByNazwaContainingIgnoreCase(String nazwaFragment);

    List<Planeta> findByMasaGreaterThan(Double masa);

    List<Planeta> findByPromienLessThan(Double promien);

    List<Planeta> findByMaAtmosfereTrue();

    List<Planeta> findByGwiazdaId(Integer gwiazdaId);
}
