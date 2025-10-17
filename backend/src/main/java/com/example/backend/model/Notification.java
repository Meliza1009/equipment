package com.example.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    @Column(name = "user_id")
    public Long userId;
    
    public String title;
    
    @Column(length = 1000)
    public String message;
    
    public String type;
    
    @Column(name = "is_read")
    public boolean read = false;
    
    public String link;
    
    @Column(name = "created_at")
    public LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "read_at")
    public LocalDateTime readAt;
}
