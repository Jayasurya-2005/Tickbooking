package com.tickbook.cinima.controller;

import org.springframework.web.bind.annotation.*;

import com.tickbook.cinima.dto.BookingRequest;
import com.tickbook.cinima.dto.BookingResponse;
import com.tickbook.cinima.service.BookingService;

@RestController
@RequestMapping("/booking")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public BookingResponse createBooking(@RequestBody BookingRequest request) {
        return bookingService.createBooking(request);
    }
}