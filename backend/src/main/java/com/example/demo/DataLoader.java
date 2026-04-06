package com.example.demo;

import com.example.demo.dto.GwiazdaDTO;
import com.example.demo.dto.CzarnaDziuraDTO;
import com.example.demo.dto.GwiazdozbiorDTO;
import com.example.demo.dto.PlanetaDTO;
import com.example.demo.dto.AsteroidaDTO;
import com.example.demo.repositories.GalaktykaRepository;
import com.example.demo.repositories.GwiazdaRepository;
import com.example.demo.repositories.GwiazdozbiorRepository;
import com.example.demo.repositories.PlanetaRepository;
import com.example.demo.repositories.UzytkownikRepository;
import com.example.demo.repositories.CzarnaDziuraRepository;
import com.example.demo.repositories.AsteroidaRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
@Profile("dev")
public class DataLoader implements CommandLineRunner {

    private final GwiazdaRepository gwiazdaRepo;
    private final GalaktykaRepository galaktykaRepo;
    private final GwiazdozbiorRepository gwiazdozbiorRepo;
    private final UzytkownikRepository uzytkownikRepo;
    private final CzarnaDziuraRepository czarnaDziuraRepo;
    private final AsteroidaRepository asteroidaRepo;
    private final PlanetaRepository planetaRepo;
    
    public DataLoader(GwiazdaRepository gwiazdaRepo,
                      GalaktykaRepository galaktykaRepo,
                      GwiazdozbiorRepository gwiazdozbiorRepo,
                      UzytkownikRepository uzytkownikRepo,
                      CzarnaDziuraRepository czarnaDziuraRepo,
                      AsteroidaRepository asteroidaRepo,
                      PlanetaRepository planetaRepo) {
        this.gwiazdaRepo = gwiazdaRepo;
        this.galaktykaRepo = galaktykaRepo;
        this.gwiazdozbiorRepo = gwiazdozbiorRepo;
        this.uzytkownikRepo = uzytkownikRepo;
        this.czarnaDziuraRepo = czarnaDziuraRepo;
        this.asteroidaRepo = asteroidaRepo;
        this.planetaRepo = planetaRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        if (gwiazdaRepo.count() > 100) {
            System.out.println("Gwiazdy już są w bazie – loader pominięty.");
        } else {
            ObjectMapper mapper = new ObjectMapper();
            TypeReference<List<GwiazdaDTO>> typeRef = new TypeReference<>() {};
            InputStream inputStream = TypeReference.class.getResourceAsStream("/data/gwiazdy.json");
            if (inputStream == null) {
                System.out.println("Nie znaleziono pliku gwiazdy.json w resources/data");
            } else {
                List<GwiazdaDTO> stars = mapper.readValue(inputStream, typeRef);
                for (GwiazdaDTO dto : stars) {
                    Gwiazda g = new Gwiazda();
                    g.setNazwa(dto.getNazwa());
                    g.setMasa(dto.getMasa());
                    g.setPromien(dto.getPromien());
                    g.setTypSpektralny(dto.getTypSpektralny());
                    g.setJasnosc(dto.getJasnosc());
                    g.setTemperatura(dto.getTemperatura());
                    if (dto.getGalaktykaId() != null)
                        g.setGalaktyka(galaktykaRepo.findById(dto.getGalaktykaId()).orElse(null));
                    if (dto.getGwiazdozbiorId() != null)
                        g.setGwiazdozbior(gwiazdozbiorRepo.findById(dto.getGwiazdozbiorId()).orElse(null));
                    if (dto.getUtworzylId() != null)
                        g.setUtworzyl(uzytkownikRepo.findById(dto.getUtworzylId()).orElse(null));
                    gwiazdaRepo.save(g);
                }
                System.out.println("Załadowano gwiazdy z JSON");
            }
        }

        if (czarnaDziuraRepo.count() > 0) {
            System.out.println("Czarne dziury już są w bazie – loader pominięty.");
        } else {
            ObjectMapper mapper = new ObjectMapper();
            TypeReference<List<CzarnaDziuraDTO>> typeRef = new TypeReference<>() {};
            InputStream inputStream = TypeReference.class.getResourceAsStream("/data/czarne_dziury.json");
            if (inputStream == null) {
                System.out.println("Nie znaleziono pliku czarne_dziury.json w resources/data");
            } else {
                List<CzarnaDziuraDTO> blackHoles = mapper.readValue(inputStream, typeRef);
                for (CzarnaDziuraDTO dto : blackHoles) {
                    CzarnaDziura c = new CzarnaDziura();
                    c.setNazwa(dto.getNazwa());
                    c.setMasa(dto.getMasa());
                    c.setPromienSchwarzschilda(dto.getPromienSchwarzschilda());
                    c.setTyp(dto.getTyp());
                    if (dto.getGalaktykaId() != null)
                        c.setGalaktyka(galaktykaRepo.findById(dto.getGalaktykaId()).orElse(null));
                    if (dto.getUtworzylId() != null)
                        c.setUtworzyl(uzytkownikRepo.findById(dto.getUtworzylId()).orElse(null));
                    czarnaDziuraRepo.save(c);
                }
                System.out.println("Załadowano czarne dziury z JSON");
            }
        }

        if (gwiazdozbiorRepo.count() > 10) {
            System.out.println("Gwiazdozbiory już są w bazie – loader pominięty.");
        } else {
            ObjectMapper mapper = new ObjectMapper();
            TypeReference<List<GwiazdozbiorDTO>> typeRef = new TypeReference<>() {};
            InputStream inputStream = TypeReference.class.getResourceAsStream("/data/gwiazdozbiory.json");
            if (inputStream == null) {
                System.out.println("Nie znaleziono pliku gwiazdozbiory.json w resources/data");
            } else {
                List<GwiazdozbiorDTO> gwiazdozbiory = mapper.readValue(inputStream, typeRef);
                for (GwiazdozbiorDTO dto : gwiazdozbiory) {
                    Gwiazdozbior gz = new Gwiazdozbior();
                    gz.setNazwa(dto.getNazwa());
                    gz.setOpis(dto.getOpis());
                    if (dto.getGalaktykaId() != null)
                        gz.setGalaktyka(galaktykaRepo.findById(dto.getGalaktykaId()).orElse(null));
                    if (dto.getUtworzylId() != null)
                        gz.setUtworzyl(uzytkownikRepo.findById(dto.getUtworzylId()).orElse(null));
                    gwiazdozbiorRepo.save(gz);
                }
                System.out.println("Załadowano gwiazdozbiory z JSON");
            }
        }

        if (asteroidaRepo.count() > 5) {
            System.out.println("Asteroidy już są w bazie – loader pominięty.");
        } else {
            ObjectMapper mapper = new ObjectMapper();
            TypeReference<List<AsteroidaDTO>> typeRef = new TypeReference<>() {};
            InputStream inputStream = TypeReference.class.getResourceAsStream("/data/asteroidy.json");
            if (inputStream == null) {
                System.out.println("Nie znaleziono pliku asteroidy.json w resources/data");
            } else {
                List<AsteroidaDTO> asteroidy = mapper.readValue(inputStream, typeRef);
                for (AsteroidaDTO dto : asteroidy) {
                    Asteroida a = new Asteroida();
                    a.setNazwa(dto.getNazwa());
                    a.setMasa(dto.getMasa());
                    a.setSrednica(dto.getSrednica());
                    a.setSklad(dto.getSklad());
                    a.setOrbita(dto.getOrbita());
                    if (dto.getGalaktykaId() != null)
                        a.setGalaktyka(galaktykaRepo.findById(dto.getGalaktykaId()).orElse(null));
                    if (dto.getUtworzylId() != null)
                        a.setUtworzyl(uzytkownikRepo.findById(dto.getUtworzylId()).orElse(null));
                    asteroidaRepo.save(a);
                }
                System.out.println("Załadowano asteroidy z JSON");
            }
        }
        if (planetaRepo.count() > 9) {
            System.out.println("Planety już są w bazie – loader pominięty.");
        } else {
            ObjectMapper mapper = new ObjectMapper();
            TypeReference<List<PlanetaDTO>> typeRef = new TypeReference<>() {};
            InputStream inputStream = TypeReference.class.getResourceAsStream("/data/planety.json");
            if (inputStream == null) {
                System.out.println("Nie znaleziono pliku planety.json w resources/data");
            } else {
                List<PlanetaDTO> planety = mapper.readValue(inputStream, typeRef);
                for (PlanetaDTO dto : planety) {
                    Planeta p = new Planeta();
                    p.setNazwa(dto.getNazwa());
                    p.setMasa(dto.getMasa());
                    p.setPromien(dto.getPromien());
                    p.setMaAtmosfere(dto.getMaAtmosfere());
                    p.setOdlegloscOdGwiazdy(dto.getOdlegloscOdGwiazdy());
                    if (dto.getGwiazdaId() != null) {
                        p.setGwiazda(gwiazdaRepo.findById(dto.getGwiazdaId()).orElse(null));
                    }
                    if (dto.getGalaktykaId() != null) {
                        p.setGalaktyka(galaktykaRepo.findById(dto.getGalaktykaId()).orElse(null));
                    }
                    if (dto.getUtworzylId() != null) {
                        p.setUtworzyl(uzytkownikRepo.findById(dto.getUtworzylId()).orElse(null));
                    }
                    planetaRepo.save(p);
                }
                System.out.println("Załadowano planety z JSON");
            }
        }
    }
}