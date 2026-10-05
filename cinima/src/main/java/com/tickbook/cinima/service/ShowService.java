package com.tickbook.cinima.service;

import java.util.*;

import org.springframework.stereotype.Service;

import com.tickbook.cinima.entity.Show;
import com.tickbook.cinima.repository.ShowRepository;

@Service
public class ShowService {
 private final ShowRepository showrepo;

 public ShowService(ShowRepository showrepo) {
	this.showrepo = showrepo;
 }
 	
 	public Show saveShow(Show show) {
 		return showrepo.save(show);
 	}
 	
 	public List<Show> getAllShow(){
 		return showrepo.findAll();
 	}
 	
 	public Optional<Show> getById(Long id){
 		return showrepo.findById(id);
 	}
 	
 	public List<Show> getShowsByMovieId(Long movieId) {
 	    return showrepo.findByMovieId(movieId);
 	}
 	
 	public Show updateShow(Long id,Show show) {
 		Show exisitShow = showrepo.findById(id)
 				.orElseThrow(()-> new RuntimeException("Show not found"));
 		
 		exisitShow.setMovie(show.getMovie());
 		exisitShow.setShowDate(show.getShowDate());
 		exisitShow.setAvailableSeats(show.getAvailableSeats());
 		exisitShow.setShowTime(show.getShowTime());
 		exisitShow.setTheatre(show.getTheatre());
 		exisitShow.setTicketPrice(show.getTicketPrice());
 		return showrepo.save(exisitShow);
 	}
 	
 	public void deleteShow(Long id) {
 		showrepo.deleteById(id);
 	}
 	
}
