package com.example.backend.model;

import jakarta.persistence.*;

import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "equipment")
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    public String name;
    public String category;
    
    @Column(length = 1000)
    public String description;
    
    @Column(name = "price_per_day")
    public Double pricePerDay;
    
    @Column(name = "price_per_hour")
    public Double pricePerHour;
    
    public boolean available = true;
    
    @Column(name = "operator_name")
    public String operatorName;
    
    @Column(name = "operator_id")
    public Long operatorId;
    
    @Embedded
    public Location location;
    
    public String image;
    public Double rating = 0.0;
    
    @Column(name = "total_bookings")
    public Integer totalBookings = 0;
    
    @ElementCollection
    @CollectionTable(name = "equipment_specifications", joinColumns = @JoinColumn(name = "equipment_id"))
    @MapKeyColumn(name = "spec_key")
    @Column(name = "spec_value")
    public Map<String, String> specifications = new HashMap<>();
    
    @Column(name = "maintenance_status")
    public String maintenanceStatus;
    
    @Column(name = "qr_code")
    public String qrCode;

    // mark demo data so UI or admin tools can filter if needed
    @Column(name = "is_demo", nullable = false, columnDefinition = "boolean default false")
    public Boolean demo = false;

    @Embeddable
    public static class Location {
        public Double lat;
        public Double lng;
        public String address;
    }
}
