package com.tickbook.cinima.entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.time.LocalDate;
import java.time.LocalTime;
import jakarta.persistence.*;
@Entity
@Table(name = "movie_shows")
public class Show {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
@ManyToOne
@JoinColumn(name = "movie_id")
private Movie movie;

@ManyToOne
@JoinColumn(name = "theatre_id")
private Theatre theatre;
private LocalDate showDate;
private LocalTime showTime;
private double ticketPrice;
private Integer availableSeats;

	public Show() {
		
	}
	
	
	public Show(Long id, Movie movie, Theatre theatre, LocalDate showDate, LocalTime showTime, double ticketPrice,
			Integer availableSeats) {
		super();
		this.id = id;
		this.movie = movie;
		this.theatre = theatre;
		this.showDate = showDate;
		this.showTime = showTime;
		this.ticketPrice = ticketPrice;
		this.availableSeats = availableSeats;
	}


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Movie getMovie() {
		return movie;
	}

	public void setMovie(Movie movie) {
		this.movie = movie;
	}

	public Theatre getTheatre() {
		return theatre;
	}

	public void setTheatre(Theatre theatre) {
		this.theatre = theatre;
	}

	public LocalDate getShowDate() {
		return showDate;
	}

	public void setShowDate(LocalDate showDate) {
		this.showDate = showDate;
	}

	public LocalTime getShowTime() {
		return showTime;
	}

	public void setShowTime(LocalTime showTime) {
		this.showTime = showTime;
	}

	public double getTicketPrice() {
		return ticketPrice;
	}

	public void setTicketPrice(double ticketPrice) {
		this.ticketPrice = ticketPrice;
	}

	public Integer getAvailableSeats() {
		return availableSeats;
	}

	public void setAvailableSeats(Integer availableSeats) {
		this.availableSeats = availableSeats;
	}
	
}
