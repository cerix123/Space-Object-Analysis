package com.example.demo.dto;

import java.util.Set;

public class RolaDTO {
    private Integer id;
    private String nazwa;
    private Set<Integer> uzytkownicyIds;

    // ----- GETTERY I SETTERY -----
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNazwa() { return nazwa; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public Set<Integer> getUzytkownicyIds() { return uzytkownicyIds; }
    public void setUzytkownicyIds(Set<Integer> uzytkownicyIds) { this.uzytkownicyIds = uzytkownicyIds; }
}
