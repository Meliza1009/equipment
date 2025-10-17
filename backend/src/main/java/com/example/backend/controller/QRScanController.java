package com.example.backend.controller;

import com.example.backend.model.Booking;
import com.example.backend.model.Equipment;
import com.example.backend.model.User;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.EquipmentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.QRCodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * QR Scan Controller - Handles QR-based equipment borrowing and return workflows
 */
@RestController
@RequestMapping("/api/qr-scan")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class QRScanController {

    private final EquipmentRepository equipmentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final QRCodeService qrCodeService;

    public QRScanController(
            EquipmentRepository equipmentRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository,
            QRCodeService qrCodeService
    ) {
        this.equipmentRepository = equipmentRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.qrCodeService = qrCodeService;
    }

    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    /**
     * Scan QR Code and get equipment details with available actions
     * POST /api/qr-scan/validate
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateQRCode(@RequestBody Map<String, Object> request) {
        String qrData = (String) request.get("qrData");
        
        if (qrData == null || qrData.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "QR data is required"
            ));
        }

        try {
            // Parse QR code to extract equipment ID
            Long equipmentId = parseEquipmentId(qrData);
            
            if (equipmentId == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid QR code format"
                ));
            }

            // Fetch equipment details
            Equipment equipment = equipmentRepository.findById(equipmentId).orElse(null);
            
            if (equipment == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Equipment not found"
                ));
            }

            // Get current user
            Long userId = getCurrentUserId();
            User user = userRepository.findById(userId).orElse(null);

            // Check for active booking
            List<Booking> activeBookings = bookingRepository.findByEquipmentIdAndUserId(equipmentId, userId);
            Booking activeBooking = activeBookings.stream()
                .filter(b -> "confirmed".equals(b.status) || "in-progress".equals(b.status))
                .findFirst()
                .orElse(null);

            // Check for overdue bookings
            List<Booking> overdueBookings = bookingRepository.findByUserId(userId).stream()
                .filter(b -> "overdue".equals(b.status))
                .toList();

            boolean hasOverdueItems = !overdueBookings.isEmpty();

            // Determine available actions
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("equipment", equipment);
            response.put("hasActiveBooking", activeBooking != null);
            response.put("activeBooking", activeBooking);
            response.put("hasOverdueItems", hasOverdueItems);
            response.put("canBorrow", equipment.available && !hasOverdueItems && activeBooking == null);
            response.put("canReturn", activeBooking != null);
            response.put("userName", user != null ? user.name : "Unknown");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Error processing QR code: " + e.getMessage()
            ));
        }
    }

    /**
     * Borrow equipment via QR scan (Check-Out)
     * POST /api/qr-scan/borrow
     */
    @PostMapping("/borrow")
    public ResponseEntity<?> borrowEquipment(@RequestBody Map<String, Object> request) {
        try {
            Long equipmentId = Long.valueOf(request.get("equipmentId").toString());
            String durationType = (String) request.getOrDefault("durationType", "hours");
            Integer duration = Integer.valueOf(request.getOrDefault("duration", 1).toString());
            
            // Optional: Get GPS coordinates
            Double lat = request.containsKey("latitude") ? 
                Double.valueOf(request.get("latitude").toString()) : null;
            Double lng = request.containsKey("longitude") ? 
                Double.valueOf(request.get("longitude").toString()) : null;

            Long userId = getCurrentUserId();
            User user = userRepository.findById(userId).orElse(null);
            
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "User not authenticated"
                ));
            }

            // Check for overdue items
            List<Booking> overdueBookings = bookingRepository.findByUserId(userId).stream()
                .filter(b -> "overdue".equals(b.status))
                .toList();
            
            if (!overdueBookings.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "You have overdue equipment. Please return them first.",
                    "overdueCount", overdueBookings.size()
                ));
            }

            // Get equipment
            Equipment equipment = equipmentRepository.findById(equipmentId).orElse(null);
            
            if (equipment == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Equipment not found"
                ));
            }

            if (!equipment.available) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Equipment is not available for borrowing"
                ));
            }

            // Create booking
            Booking booking = new Booking();
            booking.equipmentId = equipment.id;
            booking.equipmentName = equipment.name;
            booking.userId = userId;
            booking.userName = user.name;
            booking.operatorId = equipment.operatorId;
            booking.operatorName = equipment.operatorName;
            booking.durationType = durationType;
            booking.duration = duration;
            booking.status = "confirmed";
            booking.paymentStatus = "pending";
            booking.qrCodeScanned = true;
            booking.checkOutTime = LocalDateTime.now().toString();
            booking.createdAt = LocalDateTime.now();
            
            // Calculate total amount
            Double pricePerUnit = "hours".equals(durationType) ? 
                equipment.pricePerHour : equipment.pricePerDay;
            booking.totalAmount = pricePerUnit != null ? pricePerUnit * duration : 0.0;
            
            // Set dates
            LocalDateTime now = LocalDateTime.now();
            booking.startDate = now.toLocalDate().toString();
            booking.startTime = now.toLocalTime().toString();
            
            LocalDateTime endTime = "hours".equals(durationType) ? 
                now.plusHours(duration) : now.plusDays(duration);
            booking.endDate = endTime.toLocalDate().toString();
            booking.endTime = endTime.toLocalTime().toString();

            // Store location if provided
            if (lat != null && lng != null) {
                // In production, add location fields to Booking model
                // For now, we'll just log it
                System.out.println("Borrowing location: " + lat + ", " + lng);
            }

            // Save booking
            Booking savedBooking = bookingRepository.save(booking);

            // Update equipment status
            equipment.available = false;
            equipment.totalBookings = (equipment.totalBookings != null ? equipment.totalBookings : 0) + 1;
            equipmentRepository.save(equipment);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Equipment borrowed successfully",
                "booking", savedBooking,
                "equipment", equipment
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Error borrowing equipment: " + e.getMessage()
            ));
        }
    }

    /**
     * Return equipment via QR scan (Check-In)
     * POST /api/qr-scan/return
     */
    @PostMapping("/return")
    public ResponseEntity<?> returnEquipment(@RequestBody Map<String, Object> request) {
        try {
            Long bookingId = Long.valueOf(request.get("bookingId").toString());
            Long equipmentId = Long.valueOf(request.get("equipmentId").toString());
            
            // Optional: Get GPS coordinates
            Double lat = request.containsKey("latitude") ? 
                Double.valueOf(request.get("latitude").toString()) : null;
            Double lng = request.containsKey("longitude") ? 
                Double.valueOf(request.get("longitude").toString()) : null;

            // Get booking
            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            
            if (booking == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Booking not found"
                ));
            }

            // Verify booking belongs to current user or operator
            Long userId = getCurrentUserId();
            if (!booking.userId.equals(userId) && !booking.operatorId.equals(userId)) {
                return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "message", "Unauthorized to return this equipment"
                ));
            }

            // Get equipment
            Equipment equipment = equipmentRepository.findById(equipmentId).orElse(null);
            
            if (equipment == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Equipment not found"
                ));
            }

            // Update booking
            booking.status = "completed";
            booking.checkInTime = LocalDateTime.now().toString();
            booking.updatedAt = LocalDateTime.now();

            // Calculate late fee
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime expectedReturn = LocalDateTime.parse(booking.endDate + "T" + booking.endTime);
            
            Double lateFee = 0.0;
            if (now.isAfter(expectedReturn)) {
                // Calculate hours late
                long hoursLate = java.time.Duration.between(expectedReturn, now).toHours();
                lateFee = hoursLate * 100.0; // ₹100 per hour late
                booking.totalAmount = booking.totalAmount + lateFee;
                booking.status = "overdue-returned";
            }

            // Store return location if provided
            if (lat != null && lng != null) {
                System.out.println("Return location: " + lat + ", " + lng);
            }

            // Save booking
            Booking savedBooking = bookingRepository.save(booking);

            // Update equipment status
            equipment.available = true;
            equipmentRepository.save(equipment);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", lateFee > 0 ? 
                "Equipment returned with late fee" : 
                "Equipment returned successfully");
            response.put("booking", savedBooking);
            response.put("equipment", equipment);
            response.put("lateFee", lateFee);
            response.put("finalAmount", booking.totalAmount);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Error returning equipment: " + e.getMessage()
            ));
        }
    }

    /**
     * Get equipment details by QR code
     * GET /api/qr-scan/equipment/{qrCode}
     */
    @GetMapping("/equipment/{qrCode}")
    public ResponseEntity<?> getEquipmentByQR(@PathVariable String qrCode) {
        try {
            Long equipmentId = parseEquipmentId(qrCode);
            
            if (equipmentId == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid QR code"
                ));
            }

            Equipment equipment = equipmentRepository.findById(equipmentId).orElse(null);
            
            if (equipment == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Equipment not found"
                ));
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "equipment", equipment
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Error fetching equipment: " + e.getMessage()
            ));
        }
    }

    /**
     * Helper method to parse equipment ID from QR data
     * Supports formats:
     * - EQ-123-XXXXX
     * - QR_123
     * - EQUIPMENT:123:name:uuid
     */
    private Long parseEquipmentId(String qrData) {
        try {
            // Format: EQ-123-XXXXX
            if (qrData.startsWith("EQ-")) {
                String[] parts = qrData.split("-");
                if (parts.length >= 2) {
                    return Long.parseLong(parts[1]);
                }
            }
            
            // Format: QR_123
            if (qrData.startsWith("QR_")) {
                return Long.parseLong(qrData.substring(3));
            }
            
            // Format: EQUIPMENT:123:name:uuid
            if (qrData.startsWith("EQUIPMENT:")) {
                String[] parts = qrData.split(":");
                if (parts.length >= 2) {
                    return Long.parseLong(parts[1]);
                }
            }
            
            // Try direct numeric parsing
            return Long.parseLong(qrData);
            
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
