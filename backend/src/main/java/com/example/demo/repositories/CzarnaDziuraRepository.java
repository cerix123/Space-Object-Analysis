package com.example.demo.repositories;

import com.example.demo.CzarnaDziura;
import com.example.demo.Galaktyka;
import com.example.demo.Gwiazda;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CzarnaDziuraRepository extends JpaRepository<CzarnaDziura, Integer>, JpaSpecificationExecutor<CzarnaDziura> {

    List<CzarnaDziura> findByNazwa(String nazwa);

    List<CzarnaDziura> findByTyp(String typ);

    List<CzarnaDziura> findByMasaGreaterThan(Double masa);

    List<CzarnaDziura> findByMasaLessThan(Double masa);

    List<CzarnaDziura> findByGalaktyka(Galaktyka galaktyka);

    List<CzarnaDziura> findByTypAndGalaktyka(String typ, Galaktyka galaktyka);
}
