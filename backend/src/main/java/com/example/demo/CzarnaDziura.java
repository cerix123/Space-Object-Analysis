package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "czarna_dziura")
public class CzarnaDziura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nazwa;
    private Double masa;
    private Double promienSchwarzschilda;
    private String typ;

    @ManyToOne
    @JoinColumn(name = "galaktyka_id")
    private Galaktyka galaktyka;

    @ManyToOne
    @JoinColumn(name = "utworzyl_id")
    private Uzytkownik utworzyl;

    private LocalDateTime createdAt = LocalDateTime.now();

    // ----- GETTERY -----
    public Integer getId() { return id; }
    public String getNazwa() { return nazwa; }
    public Double getMasa() { return masa; }
    public Double getPromienSchwarzschilda() { return promienSchwarzschilda; }
    public String getTyp() { return typ; }
    public Galaktyka getGalaktyka() { return galaktyka; }
    public Uzytkownik getUtworzyl() { return utworzyl; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ----- SETTERY -----
    public void setId(Integer id) { this.id = id; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public void setMasa(Double masa) { this.masa = masa; }
    public void setPromienSchwarzschilda(Double promienSchwarzschilda) { this.promienSchwarzschilda = promienSchwarzschilda; }
    public void setTyp(String typ) { this.typ = typ; }
    public void setGalaktyka(Galaktyka galaktyka) { this.galaktyka = galaktyka; }
    public void setUtworzyl(Uzytkownik utworzyl) { this.utworzyl = utworzyl; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
