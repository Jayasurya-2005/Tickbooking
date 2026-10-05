package com.tickbook.cinima.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.tickbook.cinima.entity.Theatre;
import com.tickbook.cinima.repository.TheatreRepository;

@Service
public class Theatreservice {

    private final TheatreRepository theatreRepository;

    public Theatreservice(TheatreRepository theatreRepository) {
        this.theatreRepository = theatreRepository;
    }

    public Theatre saveTheatre(Theatre theatre) {
        return theatreRepository.save(theatre);
    }

    public List<Theatre> getAllTheatre() {
        return theatreRepository.findAll();
    }

    public Optional<Theatre> getTheatreById(Long id) {
        return theatreRepository.findById(id);
    }

    public Theatre updateTheatre(Long id, Theatre theatre) {

        Theatre existingTheatre = theatreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theatre not found"));

        existingTheatre.setName(theatre.getName());
        existingTheatre.setLocation(theatre.getLocation());

        return theatreRepository.save(existingTheatre);
    }

    public void deleteTheatre(Long id) {
        theatreRepository.deleteById(id);
    }
}