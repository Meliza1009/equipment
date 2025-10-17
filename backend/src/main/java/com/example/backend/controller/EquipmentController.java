package com.example.backend.controller;

import com.example.backend.model.Equipment;
import com.example.backend.repository.EquipmentRepository;
import com.example.backend.service.QRCodeService;
import com.example.backend.util.EquipmentImageMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/equipment")
public class EquipmentController {

    private final EquipmentRepository equipmentRepository;
    private final QRCodeService qrCodeService;

    public EquipmentController(EquipmentRepository equipmentRepository, QRCodeService qrCodeService) {
        this.equipmentRepository = equipmentRepository;
        this.qrCodeService = qrCodeService;
    }

    @GetMapping
    public ResponseEntity<List<Equipment>> getAll(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(equipmentRepository.findByCategory(category));
        }
        return ResponseEntity.ok(equipmentRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Equipment e = equipmentRepository.findById(id).orElse(null);
        if (e == null) return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        return ResponseEntity.ok(e);
    }
    
    @GetMapping("/operator/{operatorId}")
    public ResponseEntity<List<Equipment>> getByOperator(@PathVariable Long operatorId) {
        return ResponseEntity.ok(equipmentRepository.findByOperatorId(operatorId));
    }

    @PostMapping
    public ResponseEntity<Equipment> create(@RequestBody Equipment equipment) {
        // Auto-assign image if not provided
        if (!EquipmentImageMapper.hasCustomImage(equipment.image)) {
            equipment.image = EquipmentImageMapper.getImageForEquipment(equipment.name, equipment.category);
        }
        
        // Auto-generate QR code if not provided
        if (equipment.qrCode == null || equipment.qrCode.isEmpty()) {
            // Save first to get ID
            Equipment temp = equipmentRepository.save(equipment);
            
            // Generate rich QR data with equipment details
            String location = (temp.location != null && temp.location.address != null) ? 
                temp.location.address : "Equipment Center";
            String status = temp.available ? "AVAILABLE" : "BORROWED";
            
            temp.qrCode = qrCodeService.generateRichEquipmentQRData(
                temp.id, 
                temp.name, 
                location, 
                status
            );
            
            Equipment saved = equipmentRepository.save(temp);
            return ResponseEntity.ok(saved);
        }
        Equipment saved = equipmentRepository.save(equipment);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Equipment equipment) {
        if (!equipmentRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        }
        equipment.id = id;
        Equipment saved = equipmentRepository.save(equipment);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        equipmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Equipment e = equipmentRepository.findById(id).orElse(null);
        if (e == null) return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        if (body.containsKey("available")) {
            e.available = (Boolean) body.get("available");
            equipmentRepository.save(e);
        }
        return ResponseEntity.ok(e);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> categories() {
        return ResponseEntity.ok(List.of("Tractor", "Harvester", "Plow", "Irrigation", "Seeder", "Sprayer"));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Equipment>> nearby(@RequestParam double lat, @RequestParam double lng, 
                                                   @RequestParam(required = false, defaultValue = "10") double radius) {
        // Simple implementation: return all equipment (in production, use spatial queries)
        return ResponseEntity.ok(equipmentRepository.findAll());
    }
    
    @GetMapping("/{id}/qr-code")
    public ResponseEntity<?> getQRCode(@PathVariable Long id) {
        Equipment e = equipmentRepository.findById(id).orElse(null);
        if (e == null) return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        return ResponseEntity.ok(Map.of("qrCode", e.qrCode != null ? e.qrCode : "QR_" + id));
    }
}
