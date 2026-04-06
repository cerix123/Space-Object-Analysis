package com.example.demo.dto;

import org.springframework.hateoas.RepresentationModel;
import java.time.LocalDateTime;
import java.util.List;

public class GalaktykaDTO extends RepresentationModel<GalaktykaDTO> {

    private Integer id;
    private String nazwa;
    private String typ;
    private Long srednica;
    private Long liczbaGwiazd;
    private LocalDateTime createdAt;

    private Integer idUtworzyl;
    private String nazwaUtworzyl;


    private List<String> gwiazdy;
    private List<String> planety;
    private List<String> ksiezyce;
    private List<String> gwiazdozbiory;
    private List<String> asteroidy;
    private List<String> czarneDziury;

    // ----- GETTERY -----
    public Integer getId() { return id; }
    public String getNazwa() { return nazwa; }
    public String getTyp() { return typ; }
    public Long getSrednica() { return srednica; }
    public Long getLiczbaGwiazd() { return liczbaGwiazd; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Integer getIdUtworzyl() { return idUtworzyl; }
    public String getNazwaUtworzyl() { return nazwaUtworzyl; }

    public List<String> getGwiazdy() { return gwiazdy; }
    public List<String> getPlanety() { return planety; }
    public List<String> getKsiezyce() { return ksiezyce; }
    public List<String> getGwiazdozbiory() { return gwiazdozbiory; }
    public List<String> getAsteroidy() { return asteroidy; }
    public List<String> getCzarneDziury() { return czarneDziury; }

    // ----- SETTERY -----
    public void setId(Integer id) { this.id = id; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public void setTyp(String typ) { this.typ = typ; }
    public void setSrednica(Long srednica) { this.srednica = srednica; }
    public void setLiczbaGwiazd(Long liczbaGwiazd) { this.liczbaGwiazd = liczbaGwiazd; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setIdUtworzyl(Integer idUtworzyl) { this.idUtworzyl = idUtworzyl; }
    public void setNazwaUtworzyl(String nazwaUtworzyl) { this.nazwaUtworzyl = nazwaUtworzyl; }

    public void setGwiazdy(List<String> gwiazdy) { this.gwiazdy = gwiazdy; }
    public void setPlanety(List<String> planety) { this.planety = planety; }
    public void setKsiezyce(List<String> ksiezyce) { this.ksiezyce = ksiezyce; }
    public void setGwiazdozbiory(List<String> gwiazdozbiory) { this.gwiazdozbiory = gwiazdozbiory; }
    public void setAsteroidy(List<String> asteroidy) { this.asteroidy = asteroidy; }
    public void setCzarneDziury(List<String> czarneDziury) { this.czarneDziury = czarneDziury; }
}
