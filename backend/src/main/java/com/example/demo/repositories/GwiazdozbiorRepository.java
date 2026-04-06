package com.example.demo.repositories;

import com.example.demo.Gwiazdozbior;
import com.example.demo.Galaktyka;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GwiazdozbiorRepository extends JpaRepository<Gwiazdozbior, Integer>, JpaSpecificationExecutor<Gwiazdozbior> {


    List<Gwiazdozbior> findByNazwa(String nazwa);

    List<Gwiazdozbior> findByGalaktyka(Galaktyka galaktyka);

    List<Gwiazdozbior> findByNazwaContainingIgnoreCase(String fragmentNazwa);

    List<Gwiazdozbior> findByOpisContainingIgnoreCase(String fragmentOpisu);

    List<Gwiazdozbior> findByGalaktykaAndNazwaContainingIgnoreCase(Galaktyka galaktyka, String fragmentNazwa);
}
