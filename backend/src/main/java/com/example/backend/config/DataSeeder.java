package com.example.backend.config;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.backend.model.Equipment;
import com.example.backend.repository.EquipmentRepository;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create Admin user
            if (!userRepository.existsByEmail("admin@village.com")) {
                User admin = new User();
                admin.name = "Admin User";
                admin.email = "admin@village.com";
                admin.phone = "+91 9876543200";
                admin.role = "ADMIN";
                admin.password = passwordEncoder.encode("password");
                userRepository.save(admin);
                System.out.println("✅ Admin user created: admin@village.com / password");
            } else {
                System.out.println("ℹ️  Admin user already exists");
            }
            
            // Create Operator user
            if (!userRepository.existsByEmail("operator@village.com")) {
                User operator = new User();
                operator.name = "Ramesh Kumar";
                operator.email = "operator@village.com";
                operator.phone = "+91 9876543220";
                operator.role = "OPERATOR";
                operator.address = "Khera Village";
                operator.village = "Khera";
                operator.password = passwordEncoder.encode("password");
                userRepository.save(operator);
                System.out.println("✅ Operator user created: operator@village.com / password");
            } else {
                System.out.println("ℹ️  Operator user already exists");
            }
            
            // Create regular User
            if (!userRepository.existsByEmail("user@village.com")) {
                User user = new User();
                user.name = "Mohan Lal";
                user.email = "user@village.com";
                user.phone = "+91 9876543210";
                user.role = "USER";
                user.address = "Khera Village";
                user.village = "Khera";
                user.password = passwordEncoder.encode("password");
                userRepository.save(user);
                System.out.println("✅ Regular user created: user@village.com / password");
            } else {
                System.out.println("ℹ️  Regular user already exists");
            }

            // Seed a few equipment items if table is empty
            // We'll inject EquipmentRepository via the ApplicationContext in a small hack
            try {
                EquipmentRepository equipmentRepository = com.example.backend.config.ApplicationContextProvider.getBean(EquipmentRepository.class);
                if (equipmentRepository.count() == 0) {
                    System.out.println("✅ Seeding initial equipment data...");
                    Equipment e1 = new Equipment();
                    e1.name = "Mahindra 575 DI";
                    e1.category = "Tractor";
                    e1.description = "Reliable 45 HP tractor suitable for plowing and hauling.";
                    e1.pricePerHour = 500.0;
                    e1.pricePerDay = 3500.0;
                    e1.available = true;
                    e1.operatorName = "Ramesh Kumar";
                    e1.operatorId = 2L; // operator seeded above
                    e1.location = new Equipment.Location();
                    e1.location.lat = 10.5276;
                    e1.location.lng = 76.2144;
                    e1.location.address = "Khera Village, District";
                    e1.image = "https://images.unsplash.com/photo-1571854370915-9e0c0b6c9e7a";
                    equipmentRepository.save(e1);

                    Equipment e2 = new Equipment();
                    e2.name = "Kamal Combine Harvester";
                    e2.category = "Harvester";
                    e2.description = "High-efficiency harvester for small to medium farms.";
                    e2.pricePerHour = 1200.0;
                    e2.pricePerDay = 8000.0;
                    e2.available = true;
                    e2.operatorName = "Operator Team";
                    e2.operatorId = 2L;
                    equipmentRepository.save(e2);
                } else {
                    System.out.println("ℹ️ Equipment table already has data");
                }
            } catch (Exception ex) {
                // ApplicationContextProvider might not be available at this stage in some environments
            }
        };
    }
}
