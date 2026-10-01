package com.cfs.BMS.controller;


import com.cfs.BMS.dto.BookingRequest;
import com.cfs.BMS.dto.PaymentInitiateResponse;
import com.cfs.BMS.entity.Booking;
import com.cfs.BMS.entity.Seat;
import com.cfs.BMS.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking Management", description = "Endpoints for creating and managing movie ticket bookings")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create a new booking and initiate payment", description = "Processes a ticket booking request, reserves seats as PENDING, and returns Stripe client secret")
    public ResponseEntity<PaymentInitiateResponse> createBooking(@RequestBody BookingRequest request)
    {
        Booking pendingBooking = bookingService.createBooking(request);
        PaymentInitiateResponse response = bookingService.initiatePayment(pendingBooking);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/confirm")
    @Operation(summary = "Confirm a booking after successful payment", description = "Verifies the payment and changes the booking status to CONFIRMED")
    public ResponseEntity<Booking> confirmBooking(@PathVariable Long id, @RequestParam String paymentIntentId)
    {
        return ResponseEntity.ok(bookingService.confirmBooking(id, paymentIntentId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID", description = "Retrieves details of a specific booking")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id)
    {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get bookings by User ID", description = "Retrieves a list of all bookings made by a specific user")
    public ResponseEntity<List<Booking>> getBookingByUserId(@PathVariable Long userId)
    {
        return ResponseEntity.ok(bookingService.getBookingByUser(userId));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking", description = "Cancels an existing booking and releases the reserved seats")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id)
    {
        return ResponseEntity.ok(bookingService.cancelbooking(id));
    }

    @GetMapping("/show/{showId}/available-seats")
    @Operation(summary = "Get available seats for a show", description = "Retrieves a list of seats that are not yet booked for a specific show")
    public ResponseEntity<List<Seat>> getAvailableSeats(@PathVariable Long showId)
    {
        return ResponseEntity.ok(bookingService.getAvailableSeats(showId));
    }


}
