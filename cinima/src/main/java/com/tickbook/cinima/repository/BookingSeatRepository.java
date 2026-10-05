package com.tickbook.cinima.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.tickbook.cinima.entity.BookingSeat;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {

    @Query("""
        SELECT bs
        FROM BookingSeat bs
        WHERE bs.seat.id = :seatId
        AND bs.show.id = :showId
    """)
    Optional<BookingSeat> findBookedSeat(Long seatId, Long showId);
}