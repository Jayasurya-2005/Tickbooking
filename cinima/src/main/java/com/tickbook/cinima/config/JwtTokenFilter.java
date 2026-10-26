package com.tickbook.cinima.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    public static final String USER_ID_ATTRIBUTE = "tickbook.authenticatedUserId";

    private final SecretKey secretKey;

    public JwtTokenFilter(@Value("${tickbook.jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");

        System.out.println("========== JWT DEBUG ==========");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Authorization header present: " + (authorization != null));

        if (authorization == null) {
            filterChain.doFilter(request, response);
            return;
        }

        if (!authorization.startsWith("Bearer ")) {
            System.out.println("JWT ERROR: Missing Bearer prefix");
            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid authentication header"
            );
            return;
        }

        try {
            String token = authorization.substring(7);

            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            Number userId = claims.get("userId", Number.class);
            String email = claims.getSubject();

            if (userId == null || email == null) {
                System.out.println("JWT ERROR: Missing userId or email");
                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Invalid authentication token"
                );
                return;
            }

            request.setAttribute(USER_ID_ATTRIBUTE, userId.longValue());

            System.out.println("JWT valid: true");
            System.out.println("Authenticated user ID: " + userId.longValue());

        } catch (JwtException | IllegalArgumentException exception) {
            System.out.println("JWT validation failed: " + exception.getClass().getSimpleName());

            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or expired authentication token"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}
