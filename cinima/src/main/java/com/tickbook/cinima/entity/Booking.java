package com.tickbook.cinima.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "show_id")
    private Show show;

    private double subtotal;

    private double gst;

    private double totalAmount;

    private LocalDateTime bookingTime;

    private String bookingStatus;

    public Booking() {
    }

    public Booking(Long id, Show show, double subtotal, double gst,
                   double totalAmount, LocalDateTime bookingTime,
                   String bookingStatus) {

        this.id = id;
        this.show = show;
        this.subtotal = subtotal;
        this.gst = gst;
        this.totalAmount = totalAmount;
        this.bookingTime = bookingTime;
        this.bookingStatus = bookingStatus;
    }
 // Getters and setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Show getShow() {
		return show;
	}

	public void setShow(Show show) {
		this.show = show;
	}

	public double getSubtotal() {
		return subtotal;
	}

	public void setSubtotal(double subtotal) {
		this.subtotal = subtotal;
	}

	public double getGst() {
		return gst;
	}

	public void setGst(double gst) {
		this.gst = gst;
	}

	public double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public LocalDateTime getBookingTime() {
		return bookingTime;
	}

	public void setBookingTime(LocalDateTime bookingTime) {
		this.bookingTime = bookingTime;
	}

	public String getBookingStatus() {
		return bookingStatus;
	}

	public void setBookingStatus(String bookingStatus) {
		this.bookingStatus = bookingStatus;
	}

    
}