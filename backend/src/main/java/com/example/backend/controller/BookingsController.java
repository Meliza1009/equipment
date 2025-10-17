package com.example.backend.controller;

import com.example.backend.model.Booking;
import com.example.backend.repository.BookingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
public class BookingsController {

    private final BookingRepository bookingRepository;

    public BookingsController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    
    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAll() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Booking b = bookingRepository.findById(id).orElse(null);
        if (b == null) return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        return ResponseEntity.ok(b);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> myBookings() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(bookingRepository.findByUserId(userId));
    }
    
    @GetMapping("/operator-bookings")
    public ResponseEntity<List<Booking>> operatorBookings() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(bookingRepository.findByOperatorId(userId));
    }

    @PostMapping
    public ResponseEntity<Booking> create(@RequestBody Booking booking) {
        booking.userId = getCurrentUserId();
        Booking saved = bookingRepository.save(booking);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Booking b = bookingRepository.findById(id).orElse(null);
        if (b == null) return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        b.status = body.getOrDefault("status", b.status);
        bookingRepository.save(b);
        return ResponseEntity.ok(b);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        Booking b = bookingRepository.findById(id).orElse(null);
        if (b == null) return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        b.status = "cancelled";
        bookingRepository.save(b);
        return ResponseEntity.ok(b);
    }

    @PostMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("available", true));
    }

    @PostMapping("/{id}/check-in")
    public ResponseEntity<?> checkIn(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Booking b = bookingRepository.findById(id).orElse(null);
        if (b == null) return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        b.status = "in-progress";
        bookingRepository.save(b);
        return ResponseEntity.ok(b);
    }

    @PostMapping("/{id}/check-out")
    public ResponseEntity<?> checkOut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Booking b = bookingRepository.findById(id).orElse(null);
        if (b == null) return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        b.status = "completed";
        bookingRepository.save(b);
        return ResponseEntity.ok(b);
    }

    @PostMapping("/calculate-cost")
    public ResponseEntity<?> calculateCost(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("totalAmount", 100.0, "duration", 1));
    }
}
