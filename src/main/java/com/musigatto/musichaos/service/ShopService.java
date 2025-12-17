package com.musigatto.musichaos.service;

import com.musigatto.musichaos.model.Inventory;
import com.musigatto.musichaos.model.Item;
import com.musigatto.musichaos.model.User;
import com.musigatto.musichaos.repository.InventoryRepository;
import com.musigatto.musichaos.repository.ItemRepository;
import com.musigatto.musichaos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ItemRepository itemRepository;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    public String buyItem(Long userId, Long itemId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        if (user.getCoins() < item.getPrice()) {
            return "Not enough coins";
        }

        // Descontar monedas
        user.setCoins(user.getCoins() - item.getPrice());
        userRepository.save(user);

        // Añadir al inventario
        Inventory inventory = Inventory.builder()
                .user(user)
                .item(item)
                .build();

        inventoryRepository.save(inventory);

        return "Item purchased";
    }
}
