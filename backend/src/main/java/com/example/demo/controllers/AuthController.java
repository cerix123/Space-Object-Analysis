package com.example.demo.controllers;

import com.example.demo.Rola;
import com.example.demo.Uzytkownik;
import com.example.demo.dto.RegisterRequestDTO;
import com.example.demo.dto.UzytkownikDTO;
import com.example.demo.repositories.RolaRepository;
import com.example.demo.repositories.UzytkownikRepository;
import com.example.demo.mappers.UzytkownikMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private RolaRepository rolaRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ---------- REJESTRACJA ----------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO dto) {
        if (uzytkownikRepository.findByUsername(dto.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", true,
                "message", "Nazwa użytkownika jest już zajęta!"
            ));
        }
        if (uzytkownikRepository.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", true,
                "message", "Email jest już zarejestrowany!"
            ));
        }


        Rola userRole = rolaRepository.findByNazwa("USER")
                .orElseGet(() -> {
                    Rola r = new Rola();
                    r.setNazwa("USER");
                    return rolaRepository.save(r);
                });



        Uzytkownik newUser = new Uzytkownik();
        newUser.setUsername(dto.getUsername());
        newUser.setEmail(dto.getEmail());
        newUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        newUser.setRole(Collections.singleton(userRole));
        newUser.setAktywny(true);

        uzytkownikRepository.save(newUser);

        return ResponseEntity.ok(Map.of(
            "error", false,
            "message", "Użytkownik zarejestrowany pomyślnie!"
        ));
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpSession session) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", true,
                "message", "Musisz podać nazwę użytkownika i hasło"
            ));
        }

        Optional<Uzytkownik> optionalUser = uzytkownikRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of(
                "error", true,
                "message", "Nie znaleziono użytkownika o tej nazwie."
            ));
        }

        Uzytkownik user = optionalUser.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of(
                "error", true,
                "message", "Nieprawidłowe hasło."
            ));
        }

        session.setAttribute("userId", user.getId());

        UzytkownikDTO dto = UzytkownikMapper.toDto(user);
        return ResponseEntity.ok(Map.of(
            "error", false,
            "message", "Zalogowano pomyślnie",
            "user", dto
        ));
    }


    // ---------- WYLOGOWANIE ----------
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of(
            "error", false,
            "message", "Wylogowano pomyślnie"
        ));
    }

    // ---------- AKTUALNY UŻYTKOWNIK ----------
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of(
                "error", true,
                "message", "Nie jesteś zalogowany"
            ));
        }

        Uzytkownik user = uzytkownikRepository.findById(userId).orElseThrow();
        UzytkownikDTO dto = UzytkownikMapper.toDto(user);
        return ResponseEntity.ok(Map.of(
            "error", false,
            "user", dto
        ));
    }

    // ---------- AKTUALIZACJA PROFILU ----------
    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@RequestBody Map<String, String> updates, HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of(
                "error", true,
                "message", "Nie jesteś zalogowany"
            ));
        }

        Uzytkownik user = uzytkownikRepository.findById(userId).orElseThrow();

        if (updates.containsKey("username") && !updates.get("username").isBlank()) {
            user.setUsername(updates.get("username"));
        }
        if (updates.containsKey("email") && !updates.get("email").isBlank()) {
            user.setEmail(updates.get("email"));
        }
        if (updates.containsKey("password") && !updates.get("password").isBlank()) {
            user.setPassword(passwordEncoder.encode(updates.get("password")));
        }

        uzytkownikRepository.save(user);
        UzytkownikDTO dto = UzytkownikMapper.toDto(user);
        return ResponseEntity.ok(Map.of(
            "error", false,
            "user", dto
        ));
    }
}
