package com.example.backend.controller;

import com.example.backend.model.Payment;
import com.example.backend.repository.PaymentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) { 
        this.paymentRepository = paymentRepository; 
    }
    
    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping("/razorpay/create-order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("orderId", "order_123", "amount", body.get("amount"), "currency", "INR", "key", "rzp_test"));
    }

    @PostMapping("/razorpay/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, Object> body) {
        Payment p = new Payment();
        p.bookingId = Long.valueOf(String.valueOf(body.getOrDefault("bookingId", "0")));
        p.userId = getCurrentUserId();
        p.amount = 100.0;
        p.status = "completed";
        p = paymentRepository.save(p);
        return ResponseEntity.ok(p);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentRepository.findByBookingId(bookingId).orElse(null));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Payment>> history() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(paymentRepository.findByUserId(userId));
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<?> refund(@PathVariable Long paymentId, @RequestBody Map<String, Object> body) {
        Payment p = paymentRepository.findById(paymentId).orElse(null);
        if (p == null) return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        p.refundAmount = Double.valueOf(String.valueOf(body.getOrDefault("amount", "0")));
        p.status = "refunded";
        paymentRepository.save(p);
        return ResponseEntity.ok(p);
    }

    @GetMapping("/fines")
    public ResponseEntity<?> getUserFines() {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/fines/calculate/{bookingId}")
    public ResponseEntity<?> calculateFine(@PathVariable Long bookingId) {
        return ResponseEntity.ok(Map.of("fineAmount", 0.0, "daysOverdue", 0));
    }
    
    @PostMapping("/fines/{fineId}/pay")
    public ResponseEntity<?> payFine(@PathVariable Long fineId, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Fine paid"));
    }
    
    @PostMapping("/fines/{fineId}/waive")
    public ResponseEntity<?> waiveFine(@PathVariable Long fineId, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Fine waived"));
    }
    
    @GetMapping("/operator/earnings")
    public ResponseEntity<?> getOperatorEarnings(@RequestParam(required = false) String startDate, 
                                                  @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(Map.of("totalEarnings", 0.0, "bookingsCount", 0));
    }
    
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<?> getTransactionDetails(@PathVariable String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId).orElse(null);
        if (payment == null) return ResponseEntity.status(404).body(Map.of("message", "Transaction not found"));
        return ResponseEntity.ok(payment);
    }
}
