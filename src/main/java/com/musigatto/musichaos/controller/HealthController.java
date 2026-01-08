package com.musigatto.musichaos.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    // This method responds to HTTP GET requests
    // at the path /api/health
    @GetMapping("/api/health")
    public String health() {
        // This is the response body
        return "ok";
    }
}
