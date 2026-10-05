package com.tickbook.cinima.dto;

public class SeatResponse {

    private Long seatId;
    private String seatNumber;
    private String rowName;
    private String status;
    private double price;

    public SeatResponse() {
    }

    public SeatResponse(Long seatId, String seatNumber,
                        String rowName, String status,
                        double price) {
        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.rowName = rowName;
        this.status = status;
        this.price = price;
    }

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getRowName() {
        return rowName;
    }

    public void setRowName(String rowName) {
        this.rowName = rowName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}