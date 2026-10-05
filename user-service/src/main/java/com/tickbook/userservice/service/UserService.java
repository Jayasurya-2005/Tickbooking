package com.tickbook.userservice.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tickbook.userservice.dto.LoginRequest;
import com.tickbook.userservice.dto.LoginResponse;
import com.tickbook.userservice.entity.User;
import com.tickbook.userservice.repository.UserRepository;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public UserService(
	        UserRepository userRepository,
	        PasswordEncoder passwordEncoder,
	        JwtService jwtService) {

	    this.userRepository = userRepository;
	    this.passwordEncoder = passwordEncoder;
	    this.jwtService = jwtService;
	}

    public User registerUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
            );

        user.setRole("USER");

        return userRepository.save(user);
    }
    public LoginResponse loginUser(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                    new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole()
        );

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                token
        );
    }
    }