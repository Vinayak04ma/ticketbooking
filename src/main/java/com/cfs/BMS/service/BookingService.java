package com.cfs.BMS.service;

import com.cfs.BMS.dto.BookingRequest;
import com.cfs.BMS.dto.PaymentInitiateResponse;
import com.cfs.BMS.entity.*;
import com.cfs.BMS.enums.BookingStatus;
import com.cfs.BMS.repository.BookingRepository;
import com.cfs.BMS.repository.SeatRepository;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final UserService userService;
    private final ShowService showService;
    private final EmailService emailService;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.public.key}")
    private String stripePublicKey;

    @Transactional
    public Booking createBooking(BookingRequest request) {
        User user = userService.getUserById(request.getUserId());
        Show show = showService.getShowById(request.getShowId());

        // Sort the seat IDs to guarantee a consistent locking order across all concurrent requests.
        List<Long> sortedSeatIds = request.getSeatIds().stream().sorted().toList();

        // Lock only the requested seats using a Pessimistic Write Lock.
        List<Seat> seats = seatRepository.findAllByIdWithLock(sortedSeatIds);
        if (seats.size() != request.getSeatIds().size()) {
            throw new RuntimeException("Some Seats Are Invalid");
        }

        // Check if any of the requested seats are already booked or currently pending checkout.
        List<Long> alreadyBookedSeats = bookingRepository.findBookedSeatIdsByShowId(show.getId());
        for (Long seatId : request.getSeatIds()) {
            if (alreadyBookedSeats.contains(seatId)) {
                throw new RuntimeException("Seat with id " + seatId + " is already Booked or Pending Checkout");
            }
        }

        double totalPrice = seats.size() * show.getTicketPrice();
        Booking booking = Booking.builder()
                .user(user)
                .show(show)
                .seats(seats)
                .totalPrice(totalPrice)
                .status(BookingStatus.PENDING) // Set as PENDING during payment
                .build();

        return bookingRepository.save(booking);
    }

    public PaymentInitiateResponse initiatePayment(Booking booking) {
        double baseAmount = booking.getTotalPrice();
        double gst = baseAmount * 0.18;
        double totalAmount = baseAmount + gst;

        // Check if Stripe key is configured and not default placeholder
        if (stripeApiKey != null && !stripeApiKey.isEmpty() && !stripeApiKey.equals("sk_test_placeholder")) {
            try {
                Stripe.apiKey = stripeApiKey;
                long amountInCents = Math.round(totalAmount * 100);

                Map<String, Object> params = new HashMap<>();
                params.put("amount", amountInCents);
                params.put("currency", "inr");
                params.put("payment_method_types", List.of("card"));

                Map<String, String> metadata = new HashMap<>();
                metadata.put("bookingId", booking.getId().toString());
                params.put("metadata", metadata);

                PaymentIntent intent = PaymentIntent.create(params);

                return PaymentInitiateResponse.builder()
                        .bookingId(booking.getId())
                        .clientSecret(intent.getClientSecret())
                        .baseAmount(baseAmount)
                        .gst(gst)
                        .totalAmount(totalAmount)
                        .publicKey(stripePublicKey)
                        .build();
            } catch (Exception e) {
                log.error("Failed to create Stripe PaymentIntent. Falling back to simulation mode. Error: {}", e.getMessage());
            }
        }

        // Simulation Mode fallback
        log.info("Running Stripe in Simulation Mode for booking ID {}", booking.getId());
        return PaymentInitiateResponse.builder()
                .bookingId(booking.getId())
                .clientSecret("simulated_secret_" + booking.getId() + "_" + System.currentTimeMillis())
                .baseAmount(baseAmount)
                .gst(gst)
                .totalAmount(totalAmount)
                .publicKey(stripePublicKey != null ? stripePublicKey : "pk_test_placeholder")
                .build();
    }

    @Transactional
    public Booking confirmBooking(Long bookingId, String paymentIntentId) {
        Booking booking = getBookingById(bookingId);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking status must be PENDING to confirm, current status: " + booking.getStatus());
        }

        // If simulated payment
        if (paymentIntentId != null && paymentIntentId.startsWith("simulated_secret_")) {
            booking.setStatus(BookingStatus.CONFIRMED);
            Booking confirmedBooking = bookingRepository.save(booking);
            log.info("Booking ID {} confirmed via Simulation Mode", bookingId);
            emailService.sendBookingConfirmation(booking.getUser().getEmail(), confirmedBooking);
            return confirmedBooking;
        }

        // Real Stripe confirmation verification
        try {
            Stripe.apiKey = stripeApiKey;
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
            if ("succeeded".equals(intent.getStatus())) {
                booking.setStatus(BookingStatus.CONFIRMED);
                Booking confirmedBooking = bookingRepository.save(booking);
                log.info("Booking ID {} confirmed via Stripe verification", bookingId);
                emailService.sendBookingConfirmation(booking.getUser().getEmail(), confirmedBooking);
                return confirmedBooking;
            } else {
                throw new RuntimeException("Stripe payment status is not succeeded: " + intent.getStatus());
            }
        } catch (Exception e) {
            throw new RuntimeException("Stripe payment verification failed: " + e.getMessage());
        }
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void cancelExpiredPendingBookings() {
        LocalDateTime expiryCutoff = LocalDateTime.now().minusMinutes(5);
        List<Booking> expiredBookings = bookingRepository.findExpiredPendingBookings(expiryCutoff);
        if (!expiredBookings.isEmpty()) {
            log.info("Found {} expired pending bookings to cancel", expiredBookings.size());
            for (Booking booking : expiredBookings) {
                booking.setStatus(BookingStatus.CANCELLED);
                bookingRepository.save(booking);
                log.info("Cancelled expired pending booking ID: {}", booking.getId());
            }
        }
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public List<Booking> getBookingByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Transactional
    public Booking cancelbooking(Long bookingid) {
        Booking booking = getBookingById(bookingid);
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    public List<Seat> getAvailableSeats(Long showId) {
        Show show = showService.getShowById(showId);
        List<Seat> allSeats = seatRepository.findByScreenId(show.getScreen().getId());
        List<Long> bookingSeatIds = bookingRepository.findBookedSeatIdsByShowId(showId);
        return allSeats.stream()
                .filter(seat -> !bookingSeatIds.contains(seat.getId()))
                .toList();
    }
}
