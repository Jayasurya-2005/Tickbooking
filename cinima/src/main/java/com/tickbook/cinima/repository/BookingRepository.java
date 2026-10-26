
package com.tickbook.cinima.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tickbook.cinima.entity.*;

public interface BookingRepository extends JpaRepository<Booking,Long> {

    java.util.List<Booking> findAllByUserIdOrderByBookingTimeDesc(Long userId);
}
