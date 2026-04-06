package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.Ksiezyc;

import java.util.List;

@Repository
public interface KsiezycRepository extends JpaRepository<Ksiezyc, Integer> {

    List<Ksiezyc> findByNazwa(String nazwa);
    List<Ksiezyc> findByPlanetaId(Integer planetaId);
    List<Ksiezyc> findByGalaktykaId(Integer galaktykaId);
    List<Ksiezyc> findByMasaGreaterThan(Double masa);
    List<Ksiezyc> findByPromienLessThan(Double promien);
}
