package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.EquipmentRepository;
import com.example.backend.repository.BookingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;
    private final BookingRepository bookingRepository;

    public AdminController(UserRepository userRepository, EquipmentRepository equipmentRepository, BookingRepository bookingRepository) { 
        this.userRepository = userRepository;
        this.equipmentRepository = equipmentRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers(@RequestParam(required = false) String role) {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> analytics(@RequestParam(required = false) String startDate, @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(Map.of(
            "totalUsers", userRepository.count(), 
            "totalEquipment", equipmentRepository.count(),
            "totalBookings", bookingRepository.count()
        ));
    }
    
    @GetMapping("/analytics/dashboard")
    public ResponseEntity<?> dashboard() {
        return ResponseEntity.ok(Map.of(
            "totalUsers", userRepository.count(), 
            "totalEquipment", equipmentRepository.count(),
            "totalBookings", bookingRepository.count(),
            "activeBookings", bookingRepository.findByStatus("in-progress").size()
        ));
    }

}
