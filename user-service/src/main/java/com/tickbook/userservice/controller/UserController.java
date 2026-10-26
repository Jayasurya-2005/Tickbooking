package com.tickbook.userservice.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.tickbook.userservice.dto.*;
import com.tickbook.userservice.entity.User;
import com.tickbook.userservice.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserProfileResponse registerUser(@RequestBody User user) {
        return toProfile(userService.registerUser(user));
    }

    @PostMapping("/login")
    public LoginResponse loginUser(
            @RequestBody LoginRequest request) {

        return userService.loginUser(request);
    }

    @GetMapping("/profile")
    public UserProfileResponse getProfile(@AuthenticationPrincipal Long userId) {
        return toProfile(userService.getUserById(userId));
    }

    private UserProfileResponse toProfile(User user) {
        return new UserProfileResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}