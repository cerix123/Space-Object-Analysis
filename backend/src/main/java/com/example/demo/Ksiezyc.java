package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ksiezyc")
public class Ksiezyc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nazwa;
    private Double masa;
    private Double promien;
    private Double odlegloscOdPlanety;

    @ManyToOne
    @JoinColumn(name = "planeta_id")
    private Planeta planeta;

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
    public Double getPromien() { return promien; }
    public Double getOdlegloscOdPlanety() { return odlegloscOdPlanety; }
    public Planeta getPlaneta() { return planeta; }
    public Galaktyka getGalaktyka() { return galaktyka; }
    public Uzytkownik getUtworzyl() { return utworzyl; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Integer id) { this.id = id; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public void setMasa(Double masa) { this.masa = masa; }
    public void setPromien(Double promien) { this.promien = promien; }
    public void setOdlegloscOdPlanety(Double odlegloscOdPlanety) { this.odlegloscOdPlanety = odlegloscOdPlanety; }
    public void setPlaneta(Planeta planeta) { this.planeta = planeta; }
    public void setGalaktyka(Galaktyka galaktyka) { this.galaktyka = galaktyka; }
    public void setUtworzyl(Uzytkownik utworzyl) { this.utworzyl = utworzyl; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
