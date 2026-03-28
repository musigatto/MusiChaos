package com.musigatto.musichaos.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    private String email;
    private String username;
    private String avatarUrl;
    private Integer coins;
    private Integer level;
}
