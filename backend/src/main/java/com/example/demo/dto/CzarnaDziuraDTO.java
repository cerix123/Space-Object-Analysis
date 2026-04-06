package com.example.demo.dto;

import java.time.LocalDateTime;

public class CzarnaDziuraDTO {
    private Integer id;
    private String nazwa;
    private Double masa;
    private Double promienSchwarzschilda;
    private String typ;
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

    public Double getPromienSchwarzschilda() { return promienSchwarzschilda; }
    public void setPromienSchwarzschilda(Double promienSchwarzschilda) { this.promienSchwarzschilda = promienSchwarzschilda; }

    public String getTyp() { return typ; }
    public void setTyp(String typ) { this.typ = typ; }

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
