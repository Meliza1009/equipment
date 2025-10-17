package com.example.backend.controller;

import com.example.backend.model.Booking;
import com.example.backend.model.Equipment;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.EquipmentRepository;
import com.example.backend.service.QRCodeService;
import com.google.zxing.WriterException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/qr")
public class QRCodeController {

    private final QRCodeService qrCodeService;
    private final EquipmentRepository equipmentRepository;
    private final BookingRepository bookingRepository;

    public QRCodeController(QRCodeService qrCodeService, 
                           EquipmentRepository equipmentRepository,
                           BookingRepository bookingRepository) {
        this.qrCodeService = qrCodeService;
        this.equipmentRepository = equipmentRepository;
        this.bookingRepository = bookingRepository;
    }

    /**
     * Generate QR code for equipment
     */
    @PostMapping("/equipment/{equipmentId}/generate")
    public ResponseEntity<?> generateEquipmentQR(@PathVariable Long equipmentId) {
        try {
            Equipment equipment = equipmentRepository.findById(equipmentId).orElse(null);
            if (equipment == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Equipment not found"));
            }

            String qrCodeImage = qrCodeService.generateEquipmentQRCode(equipmentId, equipment.name);
            String qrData = qrCodeService.generateSimpleQRData(equipmentId);
            
            // Save QR data to equipment
            equipment.qrCode = qrData;
            equipmentRepository.save(equipment);

            Map<String, Object> response = new HashMap<>();
            response.put("qrCodeImage", qrCodeImage);
            response.put("qrData", qrData);
            response.put("equipmentId", equipmentId);
            response.put("equipmentName", equipment.name);

            return ResponseEntity.ok(response);
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to generate QR code", "error", e.getMessage()));
        }
    }

    /**
     * Generate QR code for booking check-in/check-out
     */
    @PostMapping("/booking/{bookingId}/generate")
    public ResponseEntity<?> generateBookingQR(@PathVariable Long bookingId, 
                                               @RequestParam(defaultValue = "CHECK_IN") String action) {
        try {
            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            if (booking == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Booking not found"));
            }

            String qrCodeImage = qrCodeService.generateBookingQRCode(bookingId, booking.equipmentId, action);

            Map<String, Object> response = new HashMap<>();
            response.put("qrCodeImage", qrCodeImage);
            response.put("bookingId", bookingId);
            response.put("equipmentId", booking.equipmentId);
            response.put("action", action);

            return ResponseEntity.ok(response);
        } catch (WriterException | IOException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to generate booking QR code", "error", e.getMessage()));
        }
    }

    /**
     * Validate equipment QR code
     */
    @PostMapping("/equipment/validate")
    public ResponseEntity<?> validateEquipmentQR(@RequestBody Map<String, String> body) {
        String qrData = body.get("qrData");
        
        if (qrData == null || qrData.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "QR data is required"));
        }

        Map<String, Object> validationResult = qrCodeService.validateEquipmentQRCode(qrData);
        
        if (Boolean.TRUE.equals(validationResult.get("valid"))) {
            Long equipmentId = (Long) validationResult.get("equipmentId");
            Equipment equipment = equipmentRepository.findById(equipmentId).orElse(null);
            
            if (equipment == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Equipment not found", "qrValid", true));
            }
            
            Map<String, Object> response = new HashMap<>(validationResult);
            response.put("equipment", equipment);
            response.put("available", equipment.available);
            
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.badRequest().body(validationResult);
    }

    /**
     * Validate booking QR code
     */
    @PostMapping("/booking/validate")
    public ResponseEntity<?> validateBookingQR(@RequestBody Map<String, String> body) {
        String qrData = body.get("qrData");
        
        if (qrData == null || qrData.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "QR data is required"));
        }

        Map<String, Object> validationResult = qrCodeService.validateBookingQRCode(qrData);
        
        if (Boolean.TRUE.equals(validationResult.get("valid"))) {
            Long bookingId = (Long) validationResult.get("bookingId");
            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            
            if (booking == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Booking not found", "qrValid", true));
            }
            
            Map<String, Object> response = new HashMap<>(validationResult);
            response.put("booking", booking);
            
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.badRequest().body(validationResult);
    }

    /**
     * Check-in equipment using QR code
     */
    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn(@RequestBody Map<String, Object> body) {
        try {
            Long bookingId = Long.parseLong(body.get("bookingId").toString());
            String qrData = (String) body.get("qrData");

            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            if (booking == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Booking not found"));
            }

            Equipment equipment = equipmentRepository.findById(booking.equipmentId).orElse(null);
            if (equipment == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Equipment not found"));
            }

            // Verify QR code matches
            if (equipment.qrCode != null && !equipment.qrCode.equals(qrData)) {
                // Try parsing the QR data
                Map<String, Object> qrValidation = qrCodeService.validateEquipmentQRCode(qrData);
                if (!Boolean.TRUE.equals(qrValidation.get("valid")) || 
                    !booking.equipmentId.equals(qrValidation.get("equipmentId"))) {
                    return ResponseEntity.badRequest().body(Map.of("message", "QR code does not match equipment"));
                }
            }

            // Update booking check-in status
            booking.checkInTime = LocalDateTime.now().toString();
            booking.qrCodeScanned = true;
            booking.status = "active";
            booking.updatedAt = LocalDateTime.now();
            bookingRepository.save(booking);

            // Update equipment availability
            equipment.available = false;
            equipmentRepository.save(equipment);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Check-in successful");
            response.put("booking", booking);
            response.put("checkInTime", booking.checkInTime);
            response.put("equipmentStatus", "in-use");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Check-in failed", "error", e.getMessage()));
        }
    }

    /**
     * Check-out equipment using QR code
     */
    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut(@RequestBody Map<String, Object> body) {
        try {
            Long bookingId = Long.parseLong(body.get("bookingId").toString());
            String qrData = (String) body.get("qrData");

            Booking booking = bookingRepository.findById(bookingId).orElse(null);
            if (booking == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Booking not found"));
            }

            if (booking.checkInTime == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Equipment must be checked in before check-out"));
            }

            Equipment equipment = equipmentRepository.findById(booking.equipmentId).orElse(null);
            if (equipment == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Equipment not found"));
            }

            // Verify QR code matches
            if (equipment.qrCode != null && !equipment.qrCode.equals(qrData)) {
                Map<String, Object> qrValidation = qrCodeService.validateEquipmentQRCode(qrData);
                if (!Boolean.TRUE.equals(qrValidation.get("valid")) || 
                    !booking.equipmentId.equals(qrValidation.get("equipmentId"))) {
                    return ResponseEntity.badRequest().body(Map.of("message", "QR code does not match equipment"));
                }
            }

            // Update booking check-out status
            booking.checkOutTime = LocalDateTime.now().toString();
            booking.status = "completed";
            booking.updatedAt = LocalDateTime.now();
            bookingRepository.save(booking);

            // Update equipment availability
            equipment.available = true;
            equipmentRepository.save(equipment);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Check-out successful");
            response.put("booking", booking);
            response.put("checkOutTime", booking.checkOutTime);
            response.put("equipmentStatus", "available");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Check-out failed", "error", e.getMessage()));
        }
    }

    /**
     * Get equipment by QR scan
     */
    @GetMapping("/scan/{qrData}")
    public ResponseEntity<?> scanQR(@PathVariable String qrData) {
        Map<String, Object> validationResult = qrCodeService.validateEquipmentQRCode(qrData);
        
        if (Boolean.TRUE.equals(validationResult.get("valid"))) {
            Long equipmentId = (Long) validationResult.get("equipmentId");
            Equipment equipment = equipmentRepository.findById(equipmentId).orElse(null);
            
            if (equipment != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("equipment", equipment);
                response.put("qrValid", true);
                response.put("available", equipment.available);
                return ResponseEntity.ok(response);
            }
        }
        
        return ResponseEntity.status(404).body(Map.of("message", "Invalid QR code or equipment not found"));
    }
}
