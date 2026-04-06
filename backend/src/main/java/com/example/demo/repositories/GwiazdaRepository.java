package com.example.demo.repositories;

import com.example.demo.Gwiazda;
import com.example.demo.Galaktyka;
import com.example.demo.Gwiazdozbior;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GwiazdaRepository extends JpaRepository<Gwiazda, Integer>,  JpaSpecificationExecutor<Gwiazda> {

	List<Gwiazda> findByNazwa(String nazwa);
	List<Gwiazda> findByTypSpektralny(String typSpektralny);

	List<Gwiazda> findByMasaGreaterThan(Double masa);
	List<Gwiazda> findByMasaLessThan(Double masa);
	List<Gwiazda> findByPromienGreaterThan(Double promien);
	List<Gwiazda> findByPromienLessThan(Double promien);
	List<Gwiazda> findByJasnoscGreaterThan(Long jasnosc);
	List<Gwiazda> findByJasnoscLessThan(Long jasnosc);

	List<Gwiazda> findByGalaktyka(Galaktyka galaktyka);
	List<Gwiazda> findByGwiazdozbior(Gwiazdozbior gwiazdozbior);
	List<Gwiazda> findByTypSpektralnyAndMasaGreaterThan(String typSpektralny, Double masa);
}
