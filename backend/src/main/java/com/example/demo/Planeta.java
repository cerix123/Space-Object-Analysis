package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "planeta")
public class Planeta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nazwa;
    private Double masa;               
    private Double promien;            
    private Boolean maAtmosfere;
    private Double odlegloscOdGwiazdy; 

    @ManyToOne
    @JoinColumn(name = "gwiazda_id")
    private Gwiazda gwiazda;

    @ManyToOne
    @JoinColumn(name = "galaktyka_id")
    private Galaktyka galaktyka;

    @ManyToOne
    @JoinColumn(name = "utworzyl_id")
    private Uzytkownik utworzyl;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "planeta")
    private List<Ksiezyc> ksiezyce;

    // GETTERY
    public Integer getId() { return id; }
    public String getNazwa() { return nazwa; }
    public Double getMasa() { return masa; }
    public Double getPromien() { return promien; }
    public Boolean getMaAtmosfere() { return maAtmosfere; }
    public Double getOdlegloscOdGwiazdy() { return odlegloscOdGwiazdy; }
    public Gwiazda getGwiazda() { return gwiazda; }
    public Galaktyka getGalaktyka() { return galaktyka; }
    public Uzytkownik getUtworzyl() { return utworzyl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<Ksiezyc> getKsiezyce() { return ksiezyce; }

    // SETTERY
    public void setId(Integer id) { this.id = id; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public void setMasa(Double masa) { this.masa = masa; }
    public void setPromien(Double promien) { this.promien = promien; }
    public void setMaAtmosfere(Boolean maAtmosfere) { this.maAtmosfere = maAtmosfere; }
    public void setOdlegloscOdGwiazdy(Double odlegloscOdGwiazdy) { this.odlegloscOdGwiazdy = odlegloscOdGwiazdy; }
    public void setGwiazda(Gwiazda gwiazda) { this.gwiazda = gwiazda; }
    public void setGalaktyka(Galaktyka galaktyka) { this.galaktyka = galaktyka; }
    public void setUtworzyl(Uzytkownik utworzyl) { this.utworzyl = utworzyl; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setKsiezyce(List<Ksiezyc> ksiezyce) { this.ksiezyce = ksiezyce; }
}
