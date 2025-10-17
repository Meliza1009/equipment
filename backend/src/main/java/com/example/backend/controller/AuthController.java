package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        String email = (String) body.getOrDefault("email", "");
        
        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(400).body(Map.of("message", "User already exists"));
        }
        
        User u = new User();
        u.name = (String) body.getOrDefault("name", "");
        u.email = email;
        u.phone = (String) body.getOrDefault("phone", "");
        u.role = (String) body.getOrDefault("role", "user");
        u.address = (String) body.getOrDefault("address", null);
        u.village = (String) body.getOrDefault("village", null);
        
        // Hash password
        String password = (String) body.getOrDefault("password", "");
        u.password = passwordEncoder.encode(password);
        
        u = userRepository.save(u);

        // Generate JWT token
        String token = jwtUtil.generateToken(u.id, u.email, u.role);
        
        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        
        // Return user without password
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", u.id);
        userResponse.put("name", u.name);
        userResponse.put("email", u.email);
        userResponse.put("phone", u.phone);
        userResponse.put("role", u.role);
        userResponse.put("village", u.village);
        userResponse.put("address", u.address);
        resp.put("user", userResponse);
        
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        
        // Find user by email
        User found = userRepository.findByEmail(email).orElse(null);
            
        if (found == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
        
        // Verify password
        if (!passwordEncoder.matches(password, found.password)) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(found.id, found.email, found.role);
        
        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        
        // Return user without password
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", found.id);
        userResponse.put("name", found.name);
        userResponse.put("email", found.email);
        userResponse.put("phone", found.phone);
        userResponse.put("role", found.role);
        userResponse.put("village", found.village);
        userResponse.put("address", found.address);
        resp.put("user", userResponse);
        
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile() {
        // Get userId from SecurityContext (set by JWT filter)
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        User u = userRepository.findById(userId).orElse(null);
        if (u == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }
        
        // Return user without password
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", u.id);
        userResponse.put("name", u.name);
        userResponse.put("email", u.email);
        userResponse.put("phone", u.phone);
        userResponse.put("role", u.role);
        userResponse.put("village", u.village);
        userResponse.put("address", u.address);
        
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> body) {
        // Get userId from SecurityContext
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        User u = userRepository.findById(userId).orElse(null);
        if (u == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }
        
        if (body.containsKey("name")) u.name = (String) body.get("name");
        if (body.containsKey("phone")) u.phone = (String) body.get("phone");
        if (body.containsKey("address")) u.address = (String) body.get("address");
        if (body.containsKey("village")) u.village = (String) body.get("village");
        
        u = userRepository.save(u);
        
        // Return user without password
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", u.id);
        userResponse.put("name", u.name);
        userResponse.put("email", u.email);
        userResponse.put("phone", u.phone);
        userResponse.put("role", u.role);
        userResponse.put("village", u.village);
        userResponse.put("address", u.address);
        
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        // Get userId from SecurityContext
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        User u = userRepository.findById(userId).orElse(null);
        if (u == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }
        
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");
        
        // Verify old password
        if (!passwordEncoder.matches(oldPassword, u.password)) {
            return ResponseEntity.status(400).body(Map.of("message", "Current password is incorrect"));
        }
        
        // Update password
        u.password = passwordEncoder.encode(newPassword);
        userRepository.save(u);
        
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
