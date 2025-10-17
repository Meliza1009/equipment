package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    public String name;
    
    @Column(unique = true, nullable = false)
    public String email;
    
    public String phone;
    
    @JsonIgnore // Never serialize password in JSON responses
    public String password; // Hashed password
    
    public String role; // user|operator|admin
    
    public boolean active = true;
    
    @Column(name = "joined_at")
    public LocalDateTime joinedAt = LocalDateTime.now();
    
    public String village;
    
    public String address;
    
    @Column(name = "upi_id")
    public String upiId; // UPI ID for operators to receive payments

    public User() {}
}
