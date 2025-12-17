package com.musigatto.musichaos.repository;

import com.musigatto.musichaos.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
}
