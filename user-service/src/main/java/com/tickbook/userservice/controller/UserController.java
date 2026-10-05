package com.tickbook.userservice.controller;

import org.springframework.web.bind.annotation.*;

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
    public User registerUser(@RequestBody User user) {

        return userService.registerUser(user);
    }
    @PostMapping("/login")
    public LoginResponse loginUser(
            @RequestBody LoginRequest request) {

        return userService.loginUser(request);
    }
}