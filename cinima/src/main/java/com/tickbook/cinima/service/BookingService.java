package com.tickbook.cinima.service;

import java.time.LocalDateTime;
import java.util.*;
import com.tickbook.cinima.dto.BookingResponse;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.tickbook.cinima.dto.BookingRequest;
import com.tickbook.cinima.entity.*;
import com.tickbook.cinima.exception.SeatAlreadyBookedException;
import com.tickbook.cinima.repository.*;

import jakarta.transaction.Transactional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;

    public BookingService(
            BookingRepository bookingRepository,
            BookingSeatRepository bookingSeatRepository,
            ShowRepository showRepository,
            SeatRepository seatRepository) {

        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
    }
    @Transactional
    public BookingResponse createBooking(BookingRequest request, Long userId) {

        if (request.getShowId() == null || request.getSeatIds() == null || request.getSeatIds().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A show and at least one seat are required");
        }

        // 1. Find show
        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new RuntimeException("Show not found"));

        // 2. Find seats
        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());

        // 3. Check seats exist
        if (seats.size() != request.getSeatIds().size()) {
            throw new RuntimeException("One or more seats not found");
        }

        // 4. Check whether seats are already booked
        for (Long seatId : request.getSeatIds()) {

            Optional<BookingSeat> bookedSeat =
                    bookingSeatRepository.findBookedSeat(
                            seatId,
                            request.getShowId()
                    );

            if (bookedSeat.isPresent()) {
            	throw new SeatAlreadyBookedException(
            	        "Seat " + seatId + " is already booked"
            	);
            }
        }

        // 5. CALCULATE PRICE ← ADD HERE

        double subtotal = 0;

        for (Seat seat : seats) {

            double seatPrice = show.getTicketPrice();

            // A-D = Premium
            if (seat.getRowName().compareTo("D") <= 0) {
                seatPrice = seatPrice * 1.25;
            }

            subtotal += seatPrice;
        }

        // 6. GST
        double gst = subtotal * 0.18;

        // 7. Final amount
        double totalAmount = subtotal + gst;
        Booking booking = new Booking();

        booking.setShow(show);
        booking.setUserId(userId);
        booking.setSubtotal(subtotal);
        booking.setGst(gst);
        booking.setTotalAmount(totalAmount);
        booking.setBookingTime(LocalDateTime.now());
        booking.setBookingStatus("CONFIRMED");

        Booking savedBooking = bookingRepository.save(booking);
        for (Seat seat : seats) {

            BookingSeat bookingSeat = new BookingSeat();

            bookingSeat.setBooking(savedBooking);
            bookingSeat.setSeat(seat);
            bookingSeat.setShow(show);
            bookingSeatRepository.save(bookingSeat);
        }
        return toResponse(savedBooking);
    }

    @Transactional
    public List<BookingResponse> getBookingsForUser(Long userId) {
        return bookingRepository.findAllByUserIdOrderByBookingTimeDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private BookingResponse toResponse(Booking booking) {
        Show show = booking.getShow();
        BookingResponse response = new BookingResponse(
                booking.getId(),
                show.getId(),
                show.getMovie().getTitle(),
                show.getTheatre().getName(),
                show.getTheatre().getLocation(),
                show.getShowDate().toString(),
                show.getShowTime().toString(),
                booking.getSubtotal(),
                booking.getGst(),
                booking.getTotalAmount(),
                booking.getBookingStatus()
        );
        response.setBookingTime(booking.getBookingTime());
        response.setSeatNumbers(bookingSeatRepository.findAllByBooking_Id(booking.getId())
                .stream()
                .map(bookingSeat -> bookingSeat.getSeat().getSeatNumber())
                .toList());
        return response;
    }
}