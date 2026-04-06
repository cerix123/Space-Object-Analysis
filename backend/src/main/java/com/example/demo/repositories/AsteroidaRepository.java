package com.example.demo.repositories;

import com.example.demo.Asteroida;
import com.example.demo.Galaktyka;
import com.example.demo.Uzytkownik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsteroidaRepository extends JpaRepository<Asteroida, Integer>, JpaSpecificationExecutor<Asteroida> {

    Asteroida findByNazwa(String nazwa);
    List<Asteroida> findByMasaGreaterThan(Double masa);
    List<Asteroida> findByMasaLessThan(Double masa);
    List<Asteroida> findBySrednicaBetween(Double minSrednica, Double maxSrednica);
    List<Asteroida> findByGalaktyka(Galaktyka galaktyka);
    List<Asteroida> findByUtworzyl(Uzytkownik utworzyl);
    List<Asteroida> findByNazwaContaining(String fragment);
}
