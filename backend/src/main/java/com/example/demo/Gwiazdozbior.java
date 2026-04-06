package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "gwiazdozbior")
public class Gwiazdozbior {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nazwa;

    @Column(columnDefinition = "TEXT")
    private String opis;

    @ManyToOne
    @JoinColumn(name = "galaktyka_id")
    private Galaktyka galaktyka;

    @ManyToOne
    @JoinColumn(name = "utworzyl_id")
    private Uzytkownik utworzyl;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "gwiazdozbior")
    private List<Gwiazda> gwiazdy;

    // ----- GETTERY -----

    public Integer getId() {
        return id;
    }

    public String getNazwa() {
        return nazwa;
    }

    public String getOpis() {
        return opis;
    }

    public Galaktyka getGalaktyka() {
        return galaktyka;
    }

    public Uzytkownik getUtworzyl() {
        return utworzyl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<Gwiazda> getGwiazdy() {
        return gwiazdy;
    }

    // ----- SETTERY -----

    public void setId(Integer id) {
        this.id = id;
    }

    public void setNazwa(String nazwa) {
        this.nazwa = nazwa;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public void setGalaktyka(Galaktyka galaktyka) {
        this.galaktyka = galaktyka;
    }

    public void setUtworzyl(Uzytkownik utworzyl) {
        this.utworzyl = utworzyl;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setGwiazdy(List<Gwiazda> gwiazdy) {
        this.gwiazdy = gwiazdy;
    }
}
