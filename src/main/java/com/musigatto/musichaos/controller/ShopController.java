package com.musigatto.musichaos.controller;

import com.musigatto.musichaos.service.ShopService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @PostMapping("/buy")
    public ResponseEntity<?> buyItem(@RequestBody BuyRequest request, Authentication auth) {
        Long userId = Long.parseLong(auth.getName()); // Más adelante: mapear email → userId
        String result = shopService.buyItem(userId, request.getItemId());
        return ResponseEntity.ok(result);
    }

    @Data
    static class BuyRequest {
        private Long itemId;
    }
}
