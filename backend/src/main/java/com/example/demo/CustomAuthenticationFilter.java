package com.example.demo;

import com.example.demo.Uzytkownik;
import com.example.demo.dto.UzytkownikDTO;
import com.example.demo.mappers.UzytkownikMapper;
import com.example.demo.repositories.UzytkownikRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Map;

public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final UzytkownikRepository uzytkownikRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CustomAuthenticationFilter(AuthenticationManager authenticationManager,
                                      UzytkownikRepository uzytkownikRepository) {
        this.authenticationManager = authenticationManager;
        this.uzytkownikRepository = uzytkownikRepository;
        setFilterProcessesUrl("/api/auth/login"); 
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {

        try {
            Uzytkownik loginUser = objectMapper.readValue(request.getInputStream(), Uzytkownik.class);
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(loginUser.getUsername(), loginUser.getPassword());

            return authenticationManager.authenticate(authToken);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authResult) throws IOException {

        String username = authResult.getName();
        Uzytkownik user = uzytkownikRepository.findByUsername(username).orElseThrow();

        UzytkownikDTO dto = UzytkownikMapper.toDto(user);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);

        objectMapper.writeValue(response.getWriter(), Map.of(
                "error", false,
                "message", "Zalogowano pomyślnie",
                "user", dto
        ));
        response.getWriter().flush();
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request,
                                              HttpServletResponse response,
                                              AuthenticationException failed) throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        objectMapper.writeValue(response.getWriter(), Map.of(
                "error", true,
                "message", "Nieprawidłowa nazwa użytkownika lub hasło"
        ));
        response.getWriter().flush(); 
    }
}
