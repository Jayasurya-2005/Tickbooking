package com.tickbook.cinima.dto;

import java.time.LocalDateTime;
import java.util.List;

public class BookingResponse {

    private Long bookingId;
    private Long showId;

    private String movieTitle;
    private String theatreName;
    private String theatreLocation;

    private String showDate;
    private String showTime;

    private double subtotal;
    private double gst;
    private double totalAmount;

    private String bookingStatus;
    private LocalDateTime bookingTime;
    private List<String> seatNumbers;

    public BookingResponse() {
    }

    public BookingResponse(
            Long bookingId,
            Long showId,
            String movieTitle,
            String theatreName,
            String theatreLocation,
            String showDate,
            String showTime,
            double subtotal,
            double gst,
            double totalAmount,
            String bookingStatus) {

        this.bookingId = bookingId;
        this.showId = showId;
        this.movieTitle = movieTitle;
        this.theatreName = theatreName;
        this.theatreLocation = theatreLocation;
        this.showDate = showDate;
        this.showTime = showTime;
        this.subtotal = subtotal;
        this.gst = gst;
        this.totalAmount = totalAmount;
        this.bookingStatus = bookingStatus;
    }

    // Generate getters and setters for all fields
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getShowId() {
        return showId;
    }

    public void setShowId(Long showId) {
        this.showId = showId;
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

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(LocalDateTime bookingTime) {
        this.bookingTime = bookingTime;
    }

    public List<String> getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(List<String> seatNumbers) {
        this.seatNumbers = seatNumbers;
    }
    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public String getTheatreName() {
        return theatreName;
    }

    public void setTheatreName(String theatreName) {
        this.theatreName = theatreName;
    }

    public String getTheatreLocation() {
        return theatreLocation;
    }

    public void setTheatreLocation(String theatreLocation) {
        this.theatreLocation = theatreLocation;
    }

    public String getShowDate() {
        return showDate;
    }

    public void setShowDate(String showDate) {
        this.showDate = showDate;
    }

    public String getShowTime() {
        return showTime;
    }

    public void setShowTime(String showTime) {
        this.showTime = showTime;
    }
}