package com.musigatto.musichaos.repository;

import com.musigatto.musichaos.model.Inventory;
import com.musigatto.musichaos.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByUser(User user);
}
