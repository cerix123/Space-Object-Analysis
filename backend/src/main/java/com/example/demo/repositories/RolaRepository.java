package com.example.demo.repositories;

import com.example.demo.Rola;
import com.example.demo.Uzytkownik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolaRepository extends JpaRepository<Rola, Integer> {


	Optional<Rola> findByNazwa(String nazwa);

    List<Rola> findByNazwaStartingWith(String prefix);

    List<Rola> findByUzytkownicy(Uzytkownik uzytkownik);

    List<Rola> findByNazwaContaining(String fragment);
}
