package com.example.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    @Column(name = "booking_id")
    public Long bookingId;
    
    @Column(name = "user_id")
    public Long userId;
    
    public Double amount;
    
    @Column(name = "payment_method")
    public String paymentMethod;
    
    @Column(name = "transaction_id")
    public String transactionId;
    
    public String status;
    
    @Column(name = "payment_date")
    public LocalDateTime paymentDate = LocalDateTime.now();
    
    @Column(name = "refund_amount")
    public Double refundAmount;
    
    @Column(name = "refund_date")
    public LocalDateTime refundDate;
}
