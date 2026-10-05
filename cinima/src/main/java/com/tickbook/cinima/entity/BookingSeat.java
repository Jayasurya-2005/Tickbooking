package com.tickbook.cinima.entity;

import jakarta.persistence.*;

@Entity
@Table(
	    uniqueConstraints = @UniqueConstraint(
	        columnNames = {"show_id", "seat_id"}
	    )
	)
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "seat_id")
    private Seat seat;

    @ManyToOne
    @JoinColumn(name = "show_id")
    private Show show;

    public BookingSeat() {
    }

    public BookingSeat(Long id, Booking booking, Seat seat, Show show) {
        this.id = id;
        this.booking = booking;
        this.seat = seat;
        this.show = show;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public Seat getSeat() {
        return seat;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
    }

    public Show getShow() {
        return show;
    }

    public void setShow(Show show) {
        this.show = show;
    }
}