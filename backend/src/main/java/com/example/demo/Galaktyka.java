package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "galaktyka")
public class Galaktyka {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nazwa;
    private String typ;
    private Long srednica;
    private Long liczbaGwiazd;

    @ManyToOne
    @JoinColumn(name = "utworzyl_id")
    private Uzytkownik utworzyl;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "galaktyka")
    private List<Gwiazdozbior> gwiazdozbiory;

    @OneToMany(mappedBy = "galaktyka")
    private List<Gwiazda> gwiazdy;

    @OneToMany(mappedBy = "galaktyka")
    private List<Planeta> planety;

    @OneToMany(mappedBy = "galaktyka")
    private List<Ksiezyc> ksiezyce;

    @OneToMany(mappedBy = "galaktyka")
    private List<Asteroida> asteroidy;

    @OneToMany(mappedBy = "galaktyka")
    private List<CzarnaDziura> czarneDziury;

    // ----- GETTERY -----

    public Integer getId() {
        return id;
    }

    public String getNazwa() {
        return nazwa;
    }

    public String getTyp() {
        return typ;
    }

    public Long getSrednica() {
        return srednica;
    }

    public Long getLiczbaGwiazd() {
        return liczbaGwiazd;
    }

    public Uzytkownik getUtworzyl() {
        return utworzyl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<Gwiazdozbior> getGwiazdozbiory() {
        return gwiazdozbiory;
    }

    public List<Gwiazda> getGwiazdy() {
        return gwiazdy;
    }

    public List<Planeta> getPlanety() {
        return planety;
    }

    public List<Ksiezyc> getKsiezyce() {
        return ksiezyce;
    }

    public List<Asteroida> getAsteroidy() {
        return asteroidy;
    }

    public List<CzarnaDziura> getCzarneDziury() {
        return czarneDziury;
    }

    // ----- SETTERY -----

    public void setId(Integer id) {
        this.id = id;
    }

    public void setNazwa(String nazwa) {
        this.nazwa = nazwa;
    }

    public void setTyp(String typ) {
        this.typ = typ;
    }

    public void setSrednica(Long srednica) {
        this.srednica = srednica;
    }

    public void setLiczbaGwiazd(Long liczbaGwiazd) {
        this.liczbaGwiazd = liczbaGwiazd;
    }

    public void setUtworzyl(Uzytkownik utworzyl) {
        this.utworzyl = utworzyl;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setGwiazdozbiory(List<Gwiazdozbior> gwiazdozbiory) {
        this.gwiazdozbiory = gwiazdozbiory;
    }

    public void setGwiazdy(List<Gwiazda> gwiazdy) {
        this.gwiazdy = gwiazdy;
    }

    public void setPlanety(List<Planeta> planety) {
        this.planety = planety;
    }

    public void setKsiezyce(List<Ksiezyc> ksiezyce) {
        this.ksiezyce = ksiezyce;
    }

    public void setAsteroidy(List<Asteroida> asteroidy) {
        this.asteroidy = asteroidy;
    }

    public void setCzarneDziury(List<CzarnaDziura> czarneDziury) {
        this.czarneDziury = czarneDziury;
    }
}
