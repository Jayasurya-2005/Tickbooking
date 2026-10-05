package com.tickbook.cinima.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.tickbook.cinima.entity.Movie;
import com.tickbook.cinima.repository.MovieRepository;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }
    public Movie updateMovie(Long id, Movie movie) {

        Movie existingMovie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        existingMovie.setTitle(movie.getTitle());
        existingMovie.setGenre(movie.getGenre());
        existingMovie.setLanguage(movie.getLanguage());
        existingMovie.setDuration(movie.getDuration());
        existingMovie.setPosterUrl(movie.getPosterUrl());
        return movieRepository.save(existingMovie);
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }
}