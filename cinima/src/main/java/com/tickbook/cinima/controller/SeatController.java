package com.tickbook.cinima.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.tickbook.cinima.dto.SeatResponse;
import com.tickbook.cinima.entity.Seat;
import com.tickbook.cinima.service.SeatService;

@RestController
@RequestMapping("/seat")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @PostMapping
    public Seat addSeat(@RequestBody Seat seat) {
        return seatService.saveSeat(seat);
    }
    
    @PostMapping("/generate/{theatreId}")
    public List<Seat> generateSeats(@PathVariable Long theatreId) {
        return seatService.generateSeatsForTheatre(theatreId);
    }
    
    @GetMapping
    public List<Seat> getAllSeats() {
        return seatService.getAllSeats();
    }
    @GetMapping("/show/{showId}")
    public List<SeatResponse> getSeatsForShow(@PathVariable Long showId) {
        return seatService.getSeatsForShow(showId);
    }
}