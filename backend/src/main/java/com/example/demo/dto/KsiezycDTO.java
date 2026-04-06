package com.example.demo.dto;

import java.time.LocalDateTime;

public class KsiezycDTO {

    private Integer id;
    private String nazwa;
    private Double masa;
    private Double promien;
    private Double odlegloscOdPlanety;

    private Integer planetaId;
    private String planetaNazwa;

    private Integer galaktykaId;
    private String galaktykaNazwa;

    private Integer utworzylId;
    private String utworzylLogin;
    private String utworzylUsername;

    private LocalDateTime createdAt;

    public Integer getId() { return id; }
    public String getNazwa() { return nazwa; }
    public Double getMasa() { return masa; }
    public Double getPromien() { return promien; }
    public Double getOdlegloscOdPlanety() { return odlegloscOdPlanety; }
    public Integer getPlanetaId() { return planetaId; }
    public String getPlanetaNazwa() { return planetaNazwa; }
    public Integer getGalaktykaId() { return galaktykaId; }
    public String getGalaktykaNazwa() { return galaktykaNazwa; }
    public Integer getUtworzylId() { return utworzylId; }
    public String getUtworzylLogin() { return utworzylLogin; }
    public String getUtworzylUsername() { return utworzylUsername; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Integer id) { this.id = id; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public void setMasa(Double masa) { this.masa = masa; }
    public void setPromien(Double promien) { this.promien = promien; }
    public void setOdlegloscOdPlanety(Double odlegloscOdPlanety) { this.odlegloscOdPlanety = odlegloscOdPlanety; }
    public void setPlanetaId(Integer planetaId) { this.planetaId = planetaId; }
    public void setPlanetaNazwa(String planetaNazwa) { this.planetaNazwa = planetaNazwa; }
    public void setGalaktykaId(Integer galaktykaId) { this.galaktykaId = galaktykaId; }
    public void setGalaktykaNazwa(String galaktykaNazwa) { this.galaktykaNazwa = galaktykaNazwa; }
    public void setUtworzylId(Integer utworzylId) { this.utworzylId = utworzylId; }
    public void setUtworzylLogin(String utworzylLogin) { this.utworzylLogin = utworzylLogin; }
    public void setUtworzylUsername(String utworzylUsername) { this.utworzylUsername = utworzylUsername; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
