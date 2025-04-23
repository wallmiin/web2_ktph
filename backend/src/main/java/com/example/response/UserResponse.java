package com.example.response;

import lombok.Getter;

@Getter
public class UserResponse {
    private final String username;
    private final String role;

    public UserResponse(String username, String role) {
        this.username = username;
        this.role = role;
    }
}