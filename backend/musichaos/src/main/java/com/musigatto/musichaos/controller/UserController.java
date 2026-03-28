package com.musigatto.musichaos.controller;

import com.musigatto.musichaos.dto.UserProfile;
import com.musigatto.musichaos.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/api/me")
    public UserProfile me(Authentication authentication) {
        String email = authentication.getName();
        return userService.getProfile(email);
    }
}
