package com.tickbook.cinima.entity;

import jakarta.persistence.*;

@Entity
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seatNumber;

    private String rowName;

    @ManyToOne
    @JoinColumn(name = "theatre_id")
    private Theatre theatre;

    public Seat() {
    }

    public Seat( String seatNumber, String rowName, Theatre theatre) {
        this.seatNumber = seatNumber;
        this.rowName = rowName;
        this.theatre = theatre;
    }
    
 // getters and setters
    
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Theatre getTheatre() {
		return theatre;
	}

	public void setTheatre(Theatre theatre) {
		this.theatre = theatre;
	}

    
    
}