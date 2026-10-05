package com.tickbook.cinima.service;

import java.util.*;

import org.springframework.stereotype.Service;

import com.tickbook.cinima.dto.SeatResponse;
import com.tickbook.cinima.entity.Seat;
import com.tickbook.cinima.entity.*;
import com.tickbook.cinima.repository.*;


@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final TheatreRepository theatrerepo;
    private final BookingSeatRepository bookingSeatRepository;
    private final ShowRepository showRepository;
    public SeatService(
            SeatRepository seatRepository,
            TheatreRepository theatreRepository,
            BookingSeatRepository bookingSeatRepository,
            ShowRepository showRepository) {

        this.seatRepository = seatRepository;
        this.theatrerepo = theatreRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.showRepository = showRepository;
    }

    public Seat saveSeat(Seat seat) {
        return seatRepository.save(seat);
    }

    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }
    
    public List<Seat> generateSeatsForTheatre(Long theatreId) {

        Theatre theatre = theatrerepo.findById(theatreId)
                .orElseThrow(() -> new RuntimeException("Theatre not found"));
        List<Seat> seats = new ArrayList<>();
        for (char row = 'A'; row <= 'H'; row++) {
            for (int number = 1; number <= 10; number++) {
                Seat seat = new Seat();
                seat.setRowName(String.valueOf(row));
                seat.setSeatNumber(row + String.valueOf(number));
                seat.setTheatre(theatre);
                seats.add(seat);
            }
        }
        return seatRepository.saveAll(seats);
    }
    public List<SeatResponse> getSeatsForShow(Long showId) {

        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new RuntimeException("Show not found"));

        List<Seat> seats =
                seatRepository.findAll()
                        .stream()
                        .filter(seat ->
                                seat.getTheatre().getId()
                                        .equals(show.getTheatre().getId()))
                        .toList();

        List<SeatResponse> response = new ArrayList<>();

        for (Seat seat : seats) {

            Optional<BookingSeat> bookedSeat =
                    bookingSeatRepository.findBookedSeat(
                            seat.getId(),
                            showId
                    );

            String status = bookedSeat.isPresent()
                    ? "BOOKED"
                    : "AVAILABLE";

            double price = show.getTicketPrice();

            // A-D are premium
            if (seat.getRowName().compareTo("D") <= 0) {
                price = price * 1.25;
            }

            response.add(
                    new SeatResponse(
                            seat.getId(),
                            seat.getSeatNumber(),
                            seat.getRowName(),
                            status,
                            price
                    )
            );
        }

        return response;
    }
    
}