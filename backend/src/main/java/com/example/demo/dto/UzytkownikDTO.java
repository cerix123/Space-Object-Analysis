package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class UzytkownikDTO {
    private Integer id;
    private String username;
    private String email;
    private Boolean aktywny;
    private LocalDateTime createdAt;
    private Set<Integer> roleIds; 
    private Set<String> roleNames; 

    // ----- GETTERY -----
    public Integer getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public Boolean getAktywny() { return aktywny; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Set<Integer> getRoleIds() { return roleIds; }
    public Set<String> getRoleNames() { return roleNames; }

    // ----- SETTERY -----
    public void setId(Integer id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setAktywny(Boolean aktywny) { this.aktywny = aktywny; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setRoleIds(Set<Integer> roleIds) { this.roleIds = roleIds; }
    public void setRoleNames(Set<String> roleNames) { this.roleNames = roleNames; }
}
