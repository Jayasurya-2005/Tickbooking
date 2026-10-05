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

import com.tickbook.cinima.entity.Show;
import com.tickbook.cinima.service.ShowService;

@RestController
@RequestMapping("/show")
public class ShowController {
  private final ShowService showservice;

  public ShowController(ShowService showservice) {
	super();
	this.showservice = showservice;
  }
  @PostMapping
  public Show addShow(@RequestBody Show show) {
	  return showservice.saveShow(show);
  }
  
  @GetMapping
  public List<Show> getAllShow(){
	  return showservice.getAllShow();
  }
  
  @GetMapping("/{id}")
  public Optional<Show> getById(@PathVariable Long id){
	  return showservice.getById(id);
  }
  
  @PutMapping("/{id}")
  public Show updateShow(@PathVariable Long id,@RequestBody Show show) {
	  return showservice.updateShow(id, show);
  }
  
  @DeleteMapping("/{id}")
  public void deleteShow(@PathVariable Long id) {
	  showservice.deleteShow(id);
  }
  
  @GetMapping("/movie/{movieId}")
  public List<Show> getShowsByMovieId(@PathVariable Long movieId) {
      return showservice.getShowsByMovieId(movieId);
  }
  
}
