package com.example.demo.dto;

import java.time.LocalDateTime;

public class PlanetaDTO {
    private Integer id;
    private String nazwa;
    private Double masa;
    private Double promien;
    private Boolean maAtmosfere;
    private Double odlegloscOdGwiazdy;
    private Integer gwiazdaId;
    private Integer galaktykaId;
    private Integer utworzylId;
    private String utworzylUsername;
    private LocalDateTime createdAt;
    private String gwiazdaNazwa;
    private String galaktykaNazwa;

    // ----- GETTERY I SETTERY -----
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNazwa() { return nazwa; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }

    public Double getMasa() { return masa; }
    public void setMasa(Double masa) { this.masa = masa; }

    public Double getPromien() { return promien; }
    public void setPromien(Double promien) { this.promien = promien; }

    public Boolean getMaAtmosfere() { return maAtmosfere; }
    public void setMaAtmosfere(Boolean maAtmosfere) { this.maAtmosfere = maAtmosfere; }

    public Double getOdlegloscOdGwiazdy() { return odlegloscOdGwiazdy; }
    public void setOdlegloscOdGwiazdy(Double odlegloscOdGwiazdy) { this.odlegloscOdGwiazdy = odlegloscOdGwiazdy; }

    public Integer getGwiazdaId() { return gwiazdaId; }
    public void setGwiazdaId(Integer gwiazdaId) { this.gwiazdaId = gwiazdaId; }

    public Integer getGalaktykaId() { return galaktykaId; }
    public void setGalaktykaId(Integer galaktykaId) { this.galaktykaId = galaktykaId; }

    public Integer getUtworzylId() { return utworzylId; }
    public void setUtworzylId(Integer utworzylId) { this.utworzylId = utworzylId; }

    public String getUtworzylUsername() { return utworzylUsername; }
    public void setUtworzylUsername(String utworzylUsername) { this.utworzylUsername = utworzylUsername; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getGwiazdaNazwa() { return gwiazdaNazwa; }
    public void setGwiazdaNazwa(String gwiazdaNazwa) { this.gwiazdaNazwa = gwiazdaNazwa; }

    public String getGalaktykaNazwa() { return galaktykaNazwa; }
    public void setGalaktykaNazwa(String galaktykaNazwa) { this.galaktykaNazwa = galaktykaNazwa; }
}
