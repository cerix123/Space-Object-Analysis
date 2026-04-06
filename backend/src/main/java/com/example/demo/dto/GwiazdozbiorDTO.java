package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

public class GwiazdozbiorDTO {

    private Integer id;
    private String nazwa;
    private String opis;
    private Integer galaktykaId;
    private String galaktykaNazwa;
    private Integer utworzylId;
    private String utworzylLogin;
    private String utworzylUsername; 
    private LocalDateTime createdAt;
    private List<String> gwiazdyNazwa;
    
    // --- GETTERY ---
    public Integer getId() { return id; }
    public String getNazwa() { return nazwa; }
    public String getOpis() { return opis; }
    public Integer getGalaktykaId() { return galaktykaId; }
    public String getGalaktykaNazwa() { return galaktykaNazwa; }
    public Integer getUtworzylId() { return utworzylId; }
    public String getUtworzylLogin() { return utworzylLogin; }
    public String getUtworzylUsername() { return utworzylUsername; } 
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<String> getGwiazdyNazwa() { return gwiazdyNazwa; }
    
    // --- SETTERY ---
    public void setId(Integer id) { this.id = id; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public void setOpis(String opis) { this.opis = opis; }
    public void setGalaktykaId(Integer galaktykaId) { this.galaktykaId = galaktykaId; }
    public void setGalaktykaNazwa(String galaktykaNazwa) { this.galaktykaNazwa = galaktykaNazwa; }
    public void setUtworzylId(Integer utworzylId) { this.utworzylId = utworzylId; }
    public void setUtworzylLogin(String utworzylLogin) { this.utworzylLogin = utworzylLogin; }
    public void setUtworzylUsername(String utworzylUsername) { this.utworzylUsername = utworzylUsername; } // DODANE
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setGwiazdyNazwa(List<String> gwiazdyNazwa) { this.gwiazdyNazwa = gwiazdyNazwa; }
}
