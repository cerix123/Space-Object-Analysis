package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "gwiazda")
public class Gwiazda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nazwa;
    private Double masa;      
    private Double promien;   
    private String typSpektralny;
    private Long jasnosc;
    private Double temperatura;

    @ManyToOne
    @JoinColumn(name = "galaktyka_id")
    private Galaktyka galaktyka;

    @ManyToOne
    @JoinColumn(name = "gwiazdozbior_id")
    private Gwiazdozbior gwiazdozbior;

    @ManyToOne
    @JoinColumn(name = "utworzyl_id")
    private Uzytkownik utworzyl;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "gwiazda")
    private List<Planeta> planety;

    // ----- GETTERY -----
    public Integer getId() { return id; }
    public String getNazwa() { return nazwa; }
    public Double getMasa() { return masa; }
    public Double getPromien() { return promien; }
    public String getTypSpektralny() { return typSpektralny; }
    public Double getTemperatura() { return temperatura; }
    public Long getJasnosc() { return jasnosc; }
    public Galaktyka getGalaktyka() { return galaktyka; }
    public Gwiazdozbior getGwiazdozbior() { return gwiazdozbior; }
    public Uzytkownik getUtworzyl() { return utworzyl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<Planeta> getPlanety() { return planety; }

    // ----- SETTERY -----
    public void setId(Integer id) { this.id = id; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public void setMasa(Double masa) { this.masa = masa; }
    public void setPromien(Double promien) { this.promien = promien; }
    public void setTemperatura(Double temperatura) { this.temperatura = temperatura; }
    public void setTypSpektralny(String typSpektralny) { this.typSpektralny = typSpektralny; }
    public void setJasnosc(Long jasnosc) { this.jasnosc = jasnosc; }
    public void setGalaktyka(Galaktyka galaktyka) { this.galaktyka = galaktyka; }
    public void setGwiazdozbior(Gwiazdozbior gwiazdozbior) { this.gwiazdozbior = gwiazdozbior; }
    public void setUtworzyl(Uzytkownik utworzyl) { this.utworzyl = utworzyl; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setPlanety(List<Planeta> planety) { this.planety = planety; }
}
