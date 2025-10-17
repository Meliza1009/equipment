package com.example.backend.repository;

import com.example.backend.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    List<Equipment> findByOperatorId(Long operatorId);
    List<Equipment> findByCategory(String category);
    List<Equipment> findByAvailable(boolean available);
    boolean existsByName(String name);
}
