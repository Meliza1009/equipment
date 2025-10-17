package com.example.backend.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class QRCodeService {

    private static final int QR_CODE_WIDTH = 300;
    private static final int QR_CODE_HEIGHT = 300;

    /**
     * Generate a unique QR code for equipment with rich JSON data
     * @param equipmentId The equipment ID
     * @param equipmentName The equipment name
     * @param location Equipment location
     * @param status Equipment status
     * @return QR code data string containing JSON
     */
    public String generateRichEquipmentQRData(Long equipmentId, String equipmentName, String location, String status) {
        // Format: JSON-like string for easy parsing
        // Format: EQ-{id}-{randomHash}|{name}|{location}|{status}
        String uniqueCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String safeName = equipmentName != null ? equipmentName.replaceAll("[|:]", "_") : "Equipment";
        String safeLocation = location != null ? location.replaceAll("[|:]", "_") : "Unknown";
        String safeStatus = status != null ? status : "AVAILABLE";
        
        return String.format("EQ-%d-%s|%s|%s|%s", 
            equipmentId, 
            uniqueCode,
            safeName,
            safeLocation,
            safeStatus
        );
    }
    
    /**
     * Generate a unique QR code for equipment
     * @param equipmentId The equipment ID
     * @param equipmentName The equipment name
     * @return Base64 encoded QR code image
     */
    public String generateEquipmentQRCode(Long equipmentId, String equipmentName) throws WriterException, IOException {
        // Create unique QR data with timestamp for security
        String qrData = String.format("EQUIPMENT:%d:%s:%s", 
            equipmentId, 
            equipmentName.replaceAll(":", "_"), 
            UUID.randomUUID().toString().substring(0, 8)
        );
        
        return generateQRCodeImage(qrData);
    }

    /**
     * Generate QR code for booking check-in/check-out
     * @param bookingId The booking ID
     * @param equipmentId The equipment ID
     * @param action CHECK_IN or CHECK_OUT
     * @return Base64 encoded QR code image
     */
    public String generateBookingQRCode(Long bookingId, Long equipmentId, String action) throws WriterException, IOException {
        String qrData = String.format("BOOKING:%d:EQUIPMENT:%d:ACTION:%s:TIME:%s", 
            bookingId, 
            equipmentId, 
            action,
            LocalDateTime.now().toString()
        );
        
        return generateQRCodeImage(qrData);
    }

    /**
     * Generate QR code image from text data
     * @param data The data to encode in QR code
     * @return Base64 encoded PNG image
     */
    private String generateQRCodeImage(String data) throws WriterException, IOException {
        // Configure QR code generation
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(EncodeHintType.MARGIN, 1);

        // Generate QR code matrix
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, QR_CODE_WIDTH, QR_CODE_HEIGHT, hints);

        // Convert to BufferedImage
        BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

        // Convert to Base64
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(qrImage, "PNG", baos);
        byte[] imageBytes = baos.toByteArray();
        
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
    }

    /**
     * Validate and parse QR code data for equipment
     * @param qrData The scanned QR code data
     * @return Map containing parsed data
     */
    public Map<String, Object> validateEquipmentQRCode(String qrData) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String[] parts = qrData.split(":");
            
            if (parts.length >= 3 && "EQUIPMENT".equals(parts[0])) {
                result.put("valid", true);
                result.put("type", "EQUIPMENT");
                result.put("equipmentId", Long.parseLong(parts[1]));
                result.put("equipmentName", parts[2]);
                
                if (parts.length >= 4) {
                    result.put("uniqueCode", parts[3]);
                }
            } else {
                result.put("valid", false);
                result.put("error", "Invalid QR code format");
            }
        } catch (Exception e) {
            result.put("valid", false);
            result.put("error", "Failed to parse QR code: " + e.getMessage());
        }
        
        return result;
    }

    /**
     * Validate and parse QR code data for booking
     * @param qrData The scanned QR code data
     * @return Map containing parsed data
     */
    public Map<String, Object> validateBookingQRCode(String qrData) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Format: BOOKING:id:EQUIPMENT:id:ACTION:action:TIME:timestamp
            String[] parts = qrData.split(":");
            
            if (parts.length >= 8 && "BOOKING".equals(parts[0]) && "EQUIPMENT".equals(parts[2]) && "ACTION".equals(parts[4])) {
                result.put("valid", true);
                result.put("type", "BOOKING");
                result.put("bookingId", Long.parseLong(parts[1]));
                result.put("equipmentId", Long.parseLong(parts[3]));
                result.put("action", parts[5]);
                
                if (parts.length >= 8 && "TIME".equals(parts[6])) {
                    result.put("timestamp", parts[7]);
                }
            } else {
                result.put("valid", false);
                result.put("error", "Invalid booking QR code format");
            }
        } catch (Exception e) {
            result.put("valid", false);
            result.put("error", "Failed to parse booking QR code: " + e.getMessage());
        }
        
        return result;
    }

    /**
     * Generate simple text-based QR code data
     * @param equipmentId The equipment ID
     * @return QR code data string
     */
    public String generateSimpleQRData(Long equipmentId) {
        return String.format("EQ-%d-%s", equipmentId, UUID.randomUUID().toString().substring(0, 8).toUpperCase());
    }
}
