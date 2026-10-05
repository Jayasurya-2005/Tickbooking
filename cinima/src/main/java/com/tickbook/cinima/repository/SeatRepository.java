package com.tickbook.cinima.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tickbook.cinima.entity.Seat;

public interface SeatRepository extends JpaRepository<Seat, Long> {
}