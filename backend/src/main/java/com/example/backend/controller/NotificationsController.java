package com.example.backend.controller;

import com.example.backend.model.Notification;
import com.example.backend.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationsController {

    private final NotificationRepository notificationRepository;

    public NotificationsController(NotificationRepository notificationRepository) { 
        this.notificationRepository = notificationRepository; 
    }
    
    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping
    public ResponseEntity<List<Notification>> all() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(notificationRepository.findByUserId(userId));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> unreadCount() {
        Long userId = getCurrentUserId();
        long count = notificationRepository.countByUserIdAndRead(userId, false);
        return ResponseEntity.ok(count);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        Notification n = notificationRepository.findById(id).orElse(null);
        if (n == null) return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        n.read = true;
        notificationRepository.save(n);
        return ResponseEntity.ok(n);
    }

    @PatchMapping("/read-all")
    public ResponseEntity<?> readAll() {
        Long userId = getCurrentUserId();
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        notifications.forEach(n -> n.read = true);
        notificationRepository.saveAll(notifications);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) { 
        notificationRepository.deleteById(id);
        return ResponseEntity.noContent().build(); 
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody Map<String, String> body) { 
        return ResponseEntity.ok(Map.of("message", "subscribed")); 
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<?> unsubscribe() { 
        return ResponseEntity.ok(Map.of("message", "unsubscribed")); 
    }
}
