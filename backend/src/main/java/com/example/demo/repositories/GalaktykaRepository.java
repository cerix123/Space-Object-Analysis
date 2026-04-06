package com.example.demo.repositories;

import com.example.demo.Galaktyka;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GalaktykaRepository extends JpaRepository<Galaktyka, Integer> , 
	JpaSpecificationExecutor<Galaktyka>{


	 Optional<Galaktyka> findByNazwa(String nazwa);

    List<Galaktyka> findByTyp(String typ);

    List<Galaktyka> findBySrednicaGreaterThan(Long srednica);

    List<Galaktyka> findBySrednicaLessThan(Long srednica);

    List<Galaktyka> findByLiczbaGwiazdGreaterThan(Long liczbaGwiazd);

    List<Galaktyka> findByLiczbaGwiazdLessThan(Long liczbaGwiazd);

    List<Galaktyka> findByTypAndLiczbaGwiazdGreaterThan(String typ, Long liczbaGwiazd);
}
