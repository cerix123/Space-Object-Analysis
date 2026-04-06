package com.example.demo.dto;

import org.springframework.hateoas.RepresentationModel;
import java.time.LocalDateTime;

public class AsteroidaDTO extends RepresentationModel<AsteroidaDTO> {

    private Integer id;
    private String nazwa;
    private Double masa;
    private Double srednica;
    private String sklad;
    private String orbita;

    private Integer galaktykaId;
    private String galaktykaNazwa;

    private Integer utworzylId;
    private String utworzylUsername;

    private LocalDateTime createdAt;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNazwa() { return nazwa; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }

    public Double getMasa() { return masa; }
    public void setMasa(Double masa) { this.masa = masa; }

    public Double getSrednica() { return srednica; }
    public void setSrednica(Double srednica) { this.srednica = srednica; }

    public String getSklad() { return sklad; }
    public void setSklad(String sklad) { this.sklad = sklad; }

    public String getOrbita() { return orbita; }
    public void setOrbita(String orbita) { this.orbita = orbita; }

    public Integer getGalaktykaId() { return galaktykaId; }
    public void setGalaktykaId(Integer galaktykaId) { this.galaktykaId = galaktykaId; }

    public String getGalaktykaNazwa() { return galaktykaNazwa; }
    public void setGalaktykaNazwa(String galaktykaNazwa) { this.galaktykaNazwa = galaktykaNazwa; }

    public Integer getUtworzylId() { return utworzylId; }
    public void setUtworzylId(Integer utworzylId) { this.utworzylId = utworzylId; }

    public String getUtworzylUsername() { return utworzylUsername; }
    public void setUtworzylUsername(String utworzylUsername) { this.utworzylUsername = utworzylUsername; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
