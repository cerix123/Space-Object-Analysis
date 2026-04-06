package com.example.demo.repositories;

import com.example.demo.Uzytkownik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UzytkownikRepository extends JpaRepository<Uzytkownik, Integer> {


    Optional<Uzytkownik> findByUsername(String username);

    Optional<Uzytkownik> findByEmail(String email);

    List<Uzytkownik> findByAktywny(Boolean aktywny);

    List<Uzytkownik> findByRoleNazwa(String nazwaRoli);

    List<Uzytkownik> findByUsernameContainingIgnoreCase(String fragmentUsername);

    List<Uzytkownik> findByCreatedAtAfter(java.time.LocalDateTime date);
}
