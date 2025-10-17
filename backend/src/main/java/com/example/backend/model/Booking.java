package com.example.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    @Column(name = "equipment_id")
    public Long equipmentId;
    
    @Column(name = "equipment_name")
    public String equipmentName;
    
    @Column(name = "user_id")
    public Long userId;
    
    @Column(name = "user_name")
    public String userName;
    
    @Column(name = "operator_id")
    public Long operatorId;
    
    @Column(name = "operator_name")
    public String operatorName;
    
    @Column(name = "start_date")
    public String startDate;
    
    @Column(name = "end_date")
    public String endDate;
    
    @Column(name = "start_time")
    public String startTime;
    
    @Column(name = "end_time")
    public String endTime;
    
    public Integer duration;
    
    @Column(name = "duration_type")
    public String durationType; // hours|days
    
    @Column(name = "total_amount")
    public Double totalAmount;
    
    public String status = "pending";
    
    @Column(name = "payment_status")
    public String paymentStatus = "pending";
    
    @Column(name = "check_in_time")
    public String checkInTime;
    
    @Column(name = "check_out_time")
    public String checkOutTime;
    
    @Column(name = "qr_code_scanned")
    public Boolean qrCodeScanned = false;
    
    @Column(name = "created_at")
    public LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    public LocalDateTime updatedAt;
}
