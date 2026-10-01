package com.cfs.BMS.service;

import com.cfs.BMS.entity.Booking;
import com.cfs.BMS.entity.Seat;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;

import java.util.stream.Collectors;

@Service
@Slf4j
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Async
    public void sendOtp(String toEmail, String otp, int expiryMinutes) {
        log.info("----------------------------------------------------------------");
        log.info("OTP generated for email {}: {}", toEmail, otp);
        log.info("This OTP is valid for {} minutes.", expiryMinutes);
        log.info("----------------------------------------------------------------");

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject("BookMyShow - Email Verification OTP");
                message.setText("Dear User,\n\n" +
                        "Your OTP for registration on BookMyShow is: " + otp + "\n\n" +
                        "This OTP is valid for " + expiryMinutes + " minutes. Do not share this code with anyone.\n\n" +
                        "Best Regards,\n" +
                        "BookMyShow Team");
                mailSender.send(message);
                log.info("OTP email successfully sent to {}", toEmail);
            } catch (Exception e) {
                log.error("Failed to send OTP email to {}. Error: {}", toEmail, e.getMessage());
            }
        } else {
            log.warn("JavaMailSender is not configured. Real emails will not be sent.");
        }
    }

    @Async
    public void sendBookingConfirmation(String toEmail, Booking booking) {
        String movieTitle = booking.getShow().getMovie().getTitle();
        String theaterName = booking.getShow().getScreen().getTheater().getName();
        String screenName = booking.getShow().getScreen().getName();
        String showDate = booking.getShow().getShowDate().toString();
        String showTime = booking.getShow().getStartTime().toString();
        
        String seatNumbers = booking.getSeats().stream()
                .map(Seat::getSeatNumber)
                .collect(Collectors.joining(", "));

        double baseFare = booking.getTotalPrice();
        double gst = baseFare * 0.18;
        double totalPaid = baseFare + gst;

        String userName = booking.getUser().getName();

        String emailContent = String.format(
                "Dear %s,\n\n" +
                "Your ticket has been successfully booked! Here are your ticket details:\n\n" +
                "==================================================\n" +
                "TICKET SUMMARY\n" +
                "==================================================\n" +
                "Booking ID    : #%d\n" +
                "Movie Name    : %s\n" +
                "Theater       : %s\n" +
                "Screen        : %s\n" +
                "Show Date     : %s\n" +
                "Show Time     : %s\n" +
                "Seats         : %s\n" +
                "--------------------------------------------------\n" +
                "FARE BREAKDOWN\n" +
                "--------------------------------------------------\n" +
                "Ticket Base Fare  : ₹%.2f\n" +
                "GST (18%%)        : ₹%.2f\n" +
                "--------------------------------------------------\n" +
                "Total Amount Paid : ₹%.2f\n" +
                "==================================================\n\n" +
                "Thank you for booking with BookMyShow. Enjoy your movie!\n\n" +
                "Best Regards,\n" +
                "BookMyShow Team",
                userName,
                booking.getId(),
                movieTitle,
                theaterName,
                screenName,
                showDate,
                showTime,
                seatNumbers,
                baseFare,
                gst,
                totalPaid
        );

        log.info("----------------------------------------------------------------");
        log.info("Booking confirmation email content generated for {}:\n{}", toEmail, emailContent);
        log.info("----------------------------------------------------------------");

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject("BookMyShow - Booking Confirmed! Ticket ID: #" + booking.getId());
                message.setText(emailContent);
                mailSender.send(message);
                log.info("Booking confirmation email successfully sent to {}", toEmail);
            } catch (Exception e) {
                log.error("Failed to send booking confirmation email to {}. Error: {}", toEmail, e.getMessage());
            }
        } else {
            log.warn("JavaMailSender is not configured. Real booking confirmation emails will not be sent.");
        }
    }
}
