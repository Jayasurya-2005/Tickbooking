package com.tickbook.cinima.controller;

import org.springframework.web.bind.annotation.*;

import com.tickbook.cinima.dto.BookingRequest;
import com.tickbook.cinima.dto.BookingResponse;
import com.tickbook.cinima.service.BookingService;
import com.tickbook.cinima.config.JwtTokenFilter;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/booking")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public BookingResponse createBooking(@RequestBody BookingRequest request, HttpServletRequest httpRequest) {
    	return bookingService.createBooking(
    		    request,
    		    getAuthenticatedUserId(httpRequest, true)
    		);
    }

    @GetMapping("/mine")
    
    public List<BookingResponse> getMyBookings(HttpServletRequest request) {
        return bookingService.getBookingsForUser(getAuthenticatedUserId(request, true));
    }

    private Long getAuthenticatedUserId(HttpServletRequest request, boolean required) {
        Long userId = (Long) request.getAttribute(JwtTokenFilter.USER_ID_ATTRIBUTE);
        if (required && userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication is required");
        }
        return userId;
    }
}