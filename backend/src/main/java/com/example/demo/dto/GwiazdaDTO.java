package com.example.demo.dto;

import org.springframework.hateoas.RepresentationModel;
import java.time.LocalDateTime;

public class GwiazdaDTO extends RepresentationModel<GwiazdaDTO> {

    private Integer id;
    private String nazwa;
    private Double masa;    
    private Double promien; 
    private String typSpektralny;
    private Long jasnosc;
    private Double temperatura;
    
    private Integer galaktykaId;
    private String galaktykaNazwa;

    private Integer gwiazdozbiorId;
    private String gwiazdozbiorNazwa;

    private Integer utworzylId;
    private String utworzylUsername; 
    private LocalDateTime createdAt;

    // ----- GETTERY i SETTERY -----
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Double getTemperatura() { return temperatura; }
    public void setTemperatura(Double temperatura) { this.temperatura = temperatura; }
    public String getNazwa() { return nazwa; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public Double getMasa() { return masa; }
    public void setMasa(Double masa) { this.masa = masa; }
    public Double getPromien() { return promien; }
    public void setPromien(Double promien) { this.promien = promien; }
    public String getTypSpektralny() { return typSpektralny; }
    public void setTypSpektralny(String typSpektralny) { this.typSpektralny = typSpektralny; }
    public Long getJasnosc() { return jasnosc; }
    public void setJasnosc(Long jasnosc) { this.jasnosc = jasnosc; }
    public Integer getGalaktykaId() { return galaktykaId; }
    public void setGalaktykaId(Integer galaktykaId) { this.galaktykaId = galaktykaId; }
    public String getGalaktykaNazwa() { return galaktykaNazwa; }
    public void setGalaktykaNazwa(String galaktykaNazwa) { this.galaktykaNazwa = galaktykaNazwa; }
    public Integer getGwiazdozbiorId() { return gwiazdozbiorId; }
    public void setGwiazdozbiorId(Integer gwiazdozbiorId) { this.gwiazdozbiorId = gwiazdozbiorId; }
    public String getGwiazdozbiorNazwa() { return gwiazdozbiorNazwa; }
    public void setGwiazdozbiorNazwa(String gwiazdozbiorNazwa) { this.gwiazdozbiorNazwa = gwiazdozbiorNazwa; }
    public Integer getUtworzylId() { return utworzylId; }
    public void setUtworzylId(Integer utworzylId) { this.utworzylId = utworzylId; }
    public String getUtworzylUsername() { return utworzylUsername; }
    public void setUtworzylUsername(String utworzylUsername) { this.utworzylUsername = utworzylUsername; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
