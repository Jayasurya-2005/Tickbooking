package com.tickbook.cinima.entity;

import jakarta.persistence.*;

@Entity
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String genre;
    private String language;
    private Integer duration;
    private String posterUrl;
    //no-para constructor
    public Movie() {
    	
    }
    //para constructor
	public Movie(String title, String genre, String language, Integer duration,String posterurl) {
		this.title = title;
		this.genre = genre;
		this.language = language;
		this.duration = duration;
		this.posterUrl=posterUrl;
	}
	//getter and setter
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getGenre() {
		return genre;
	}
	public void setGenre(String genre) {
		this.genre = genre;
	}
	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	public Integer getDuration() {
		return duration;
	}
	public void setDuration(Integer duration) {
		this.duration = duration;
	}
	
	public String getPosterUrl() {
	    return posterUrl;
	}

	public void setPosterUrl(String posterUrl) {
	    this.posterUrl = posterUrl;
	}
}