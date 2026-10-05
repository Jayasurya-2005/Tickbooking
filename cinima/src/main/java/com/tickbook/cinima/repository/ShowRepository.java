package com.tickbook.cinima.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tickbook.cinima.entity.Show;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
public interface ShowRepository extends JpaRepository<Show, Long>{
	@Query("SELECT s FROM Show s WHERE s.movie.id = :movieId")
	List<Show> findByMovieId(@Param("movieId") Long movieId);
}
