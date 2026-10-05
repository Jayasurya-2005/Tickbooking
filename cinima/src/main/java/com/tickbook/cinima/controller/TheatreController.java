package com.tickbook.cinima.controller;

import java.util.*;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tickbook.cinima.entity.*;
import com.tickbook.cinima.service.Theatreservice;

@RestController
@RequestMapping("/theatre")
public class TheatreController {
	private final Theatreservice theatreservice;

	public TheatreController(Theatreservice theatreservice) {
		this.theatreservice = theatreservice;
	}
	
	@PostMapping
	public Theatre addMovie(@RequestBody Theatre theatre) {
		return theatreservice.saveTheatre(theatre);
	}
	
	@GetMapping
	public List<Theatre> getAllTheatre(){
		return theatreservice.getAllTheatre();
	}
	@GetMapping("/{id}")
	public Optional<Theatre> getTheatreById(@PathVariable Long id){
		return theatreservice.getTheatreById(id);
	}
	@DeleteMapping("/{id}")
	public void deleteTheatre(@PathVariable Long id) {
		theatreservice.deleteTheatre(id);
	}
	@PutMapping("/{id}")
	public Theatre updateTheatre(@PathVariable Long id,@RequestBody Theatre theatre) {
		return theatreservice.updateTheatre(id, theatre);
	}
	
}
