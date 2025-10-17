package com.example.backend.controller;

import com.example.backend.model.Equipment;
import com.example.backend.model.User;
import com.example.backend.repository.EquipmentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.EquipmentImageMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class SeedController {

    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public SeedController(EquipmentRepository equipmentRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.equipmentRepository = equipmentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/seed-demo")
    public ResponseEntity<?> seedDemo() {
        List<String> created = new ArrayList<>();

        // Create demo user if not exists
        if (!userRepository.existsByEmail("demo@village.com")) {
            User demo = new User();
            demo.name = "Demo User";
            demo.email = "demo@village.com";
            demo.password = passwordEncoder.encode("demo");
            demo.role = "USER";
            userRepository.save(demo);
            created.add("demo user");
        }

        // Demo equipment 1
        if (!equipmentRepository.existsByName("Demo Mini Tractor")) {
            Equipment d1 = new Equipment();
            d1.name = "Demo Mini Tractor";
            d1.category = "Tractor";
            d1.description = "Small demo tractor for UI testing.";
            d1.pricePerHour = 100.0;
            d1.pricePerDay = 700.0;
            d1.available = true;
            d1.operatorName = "Demo Operator";
            d1.demo = true;
            d1.image = EquipmentImageMapper.getImageForEquipment(d1.name, d1.category);
            equipmentRepository.save(d1);
            created.add("Demo Mini Tractor");
        }

        // Demo equipment 2
        if (!equipmentRepository.existsByName("Demo Water Pump")) {
            Equipment d2 = new Equipment();
            d2.name = "Demo Water Pump";
            d2.category = "Irrigation";
            d2.description = "Demo pump.";
            d2.pricePerHour = 50.0;
            d2.pricePerDay = 300.0;
            d2.available = true;
            d2.operatorName = "Demo Operator";
            d2.demo = true;
            d2.image = EquipmentImageMapper.getImageForEquipment(d2.name, d2.category);
            equipmentRepository.save(d2);
            created.add("Demo Water Pump");
        }

        if (created.isEmpty()) return ResponseEntity.ok(List.of("No changes; demo items already exist"));
        return ResponseEntity.ok(created);
    }

    @PostMapping("/seed-realistic")
    public ResponseEntity<?> seedRealistic() {
        List<String> created = new ArrayList<>();

        if (!equipmentRepository.existsByName("Mahindra 575 DI")) {
            Equipment e1 = new Equipment();
            e1.name = "Mahindra 575 DI";
            e1.category = "Tractor";
            e1.description = "Reliable 45 HP tractor suitable for plowing and hauling.";
            e1.pricePerHour = 500.0;
            e1.pricePerDay = 3500.0;
            e1.available = true;
            e1.operatorName = "Ramesh Kumar";
            e1.image = EquipmentImageMapper.getImageForEquipment(e1.name, e1.category);
            equipmentRepository.save(e1);
            created.add("Mahindra 575 DI");
        }

        if (!equipmentRepository.existsByName("Kamal Combine Harvester")) {
            Equipment e2 = new Equipment();
            e2.name = "Kamal Combine Harvester";
            e2.category = "Harvester";
            e2.description = "High-efficiency harvester for small to medium farms.";
            e2.pricePerHour = 1200.0;
            e2.pricePerDay = 8000.0;
            e2.available = true;
            e2.operatorName = "Operator Team";
            e2.image = EquipmentImageMapper.getImageForEquipment(e2.name, e2.category);
            equipmentRepository.save(e2);
            created.add("Kamal Combine Harvester");
        }

        if (created.isEmpty()) return ResponseEntity.ok(List.of("No new realistic items added; names already exist"));
        return ResponseEntity.ok(created);
    }
}
