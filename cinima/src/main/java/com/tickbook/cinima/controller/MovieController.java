package com.tickbook.cinima.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.tickbook.cinima.entity.*;
import com.tickbook.cinima.service.*;
import com.tickbook.cinima.service.MovieService;

import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/movie")
public class MovieController {
	private final MovieService Movieservice;
	//constructor
	public MovieController(MovieService movieservice) {
		Movieservice = movieservice;
	}
	
	@PostMapping
	public Movie addMovie(@RequestBody Movie movie) {
		return Movieservice.saveMovie(movie);
	}
	
	
	@GetMapping
	public List<Movie> getAllMovies(){
		return Movieservice.getAllMovies();
	}
	@GetMapping("/{id}")
	public Optional<Movie> getMovie(@PathVariable Long id){
		return Movieservice.getMovieById(id);
	}
	
	@PutMapping("/{id}")
	public Movie updateMovie(
	        @PathVariable Long id,
	        @RequestBody Movie movie) {

	    return Movieservice.updateMovie(id, movie);
	}
	
	@DeleteMapping("/{id}")
	public void deleteMovie(@PathVariable Long id) {
		Movieservice.deleteMovie(id);
	}
}
