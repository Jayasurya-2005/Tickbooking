package com.tickbook.userservice.service;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey secretKey =
            Keys.hmacShaKeyFor(
                "tickbook-secret-key-for-jwt-authentication-2026"
                    .getBytes()
            );

    public String generateToken(
            Long userId,
            String email,
            String role) {

        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(
                    new Date(
                        System.currentTimeMillis()
                        + 1000 * 60 * 60
                    )
                )
                .signWith(secretKey)
                .compact();
    }
}