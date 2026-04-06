package com.example.demo;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "rola")
public class Rola {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nazwa;

    @ManyToMany(mappedBy = "role")
    private Set<Uzytkownik> uzytkownicy;

    // ----- GETTERY -----

    public Integer getId() {
        return id;
    }

    public String getNazwa() {
        return nazwa;
    }

    public Set<Uzytkownik> getUzytkownicy() {
        return uzytkownicy;
    }

    // ----- SETTERY -----

    public void setId(Integer id) {
        this.id = id;
    }

    public void setNazwa(String nazwa) {
        this.nazwa = nazwa;
    }

    public void setUzytkownicy(Set<Uzytkownik> uzytkownicy) {
        this.uzytkownicy = uzytkownicy;
    }
}
