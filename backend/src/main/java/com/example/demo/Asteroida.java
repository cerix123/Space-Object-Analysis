package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "asteroida")
public class Asteroida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nazwa;
    private Double masa;
    private Double srednica;
    private String sklad;
    private String orbita;

    @ManyToOne
    @JoinColumn(name = "galaktyka_id")
    private Galaktyka galaktyka;

    @ManyToOne
    @JoinColumn(name = "utworzyl_id")
    private Uzytkownik utworzyl;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Integer getId() { return id; }
    public String getNazwa() { return nazwa; }
    public Double getMasa() { return masa; }
    public Double getSrednica() { return srednica; }
    public String getSklad() { return sklad; }
    public String getOrbita() { return orbita; }
    public Galaktyka getGalaktyka() { return galaktyka; }
    public Uzytkownik getUtworzyl() { return utworzyl; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Integer id) { this.id = id; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public void setMasa(Double masa) { this.masa = masa; }
    public void setSrednica(Double srednica) { this.srednica = srednica; }
    public void setSklad(String sklad) { this.sklad = sklad; }
    public void setOrbita(String orbita) { this.orbita = orbita; }
    public void setGalaktyka(Galaktyka galaktyka) { this.galaktyka = galaktyka; }
    public void setUtworzyl(Uzytkownik utworzyl) { this.utworzyl = utworzyl; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
