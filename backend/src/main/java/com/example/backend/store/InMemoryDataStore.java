package com.example.backend.store;

import com.example.backend.model.Booking;
import com.example.backend.model.Equipment;
import com.example.backend.model.Notification;
import com.example.backend.model.Payment;
import com.example.backend.model.User;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class InMemoryDataStore {
    public final Map<Long, User> users = new HashMap<>();
    public final Map<Long, Equipment> equipments = new HashMap<>();
    public final Map<Long, Booking> bookings = new HashMap<>();
    public final Map<Long, Payment> payments = new HashMap<>();
    public final Map<Long, Notification> notifications = new HashMap<>();

    private final AtomicLong userId = new AtomicLong(1);
    private final AtomicLong equipmentId = new AtomicLong(1);
    private final AtomicLong bookingId = new AtomicLong(1);
    private final AtomicLong paymentId = new AtomicLong(1);
    private final AtomicLong notificationId = new AtomicLong(1);

    public long nextUserId() { return userId.getAndIncrement(); }
    public long nextEquipmentId() { return equipmentId.getAndIncrement(); }
    public long nextBookingId() { return bookingId.getAndIncrement(); }
    public long nextPaymentId() { return paymentId.getAndIncrement(); }
    public long nextNotificationId() { return notificationId.getAndIncrement(); }

    public InMemoryDataStore() {
        // Seed an admin user with default password (bcrypt hash of "admin123")
        User admin = new User();
        admin.id = nextUserId();
        admin.name = "Admin";
        admin.email = "admin@example.com";
        admin.phone = "0000000000";
        admin.role = "admin";
        admin.password = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"; // "admin123"
        users.put(admin.id, admin);
    }
}
