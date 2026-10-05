package com.tickbook.cinima.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SeatAlreadyBookedException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public String handleSeatAlreadyBooked(
            SeatAlreadyBookedException exception) {

        return exception.getMessage();
    }
}