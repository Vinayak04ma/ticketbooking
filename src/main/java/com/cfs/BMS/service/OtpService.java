package com.cfs.BMS.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class OtpService {

    @Autowired
    private EmailService emailService;

    private final Map<String, OtpDetails> otpCache = new ConcurrentHashMap<>();
    private static final int EXPIRY_MINUTES = 5;

    public void sendOtp(String email) {
        // Generate a 6-digit random OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));
        
        // Save in cache
        otpCache.put(email, new OtpDetails(otp, LocalDateTime.now().plusMinutes(EXPIRY_MINUTES)));
        
        // Delegate OTP email sending to EmailService
        emailService.sendOtp(email, otp, EXPIRY_MINUTES);
    }

    public boolean validateOtp(String email, String inputOtp) {
        OtpDetails details = otpCache.get(email);
        if (details == null) {
            log.warn("Validation failed: No OTP found for email {}", email);
            return false;
        }

        if (details.isExpired()) {
            otpCache.remove(email);
            log.warn("Validation failed: OTP for email {} has expired", email);
            return false;
        }

        boolean isValid = details.getOtp().equals(inputOtp);
        if (isValid) {
            otpCache.remove(email); // Clean up on successful validation
            log.info("OTP successfully verified for email {}", email);
        } else {
            log.warn("Validation failed: Incorrect OTP input for email {}", email);
        }
        return isValid;
    }

    private static class OtpDetails {
        private final String otp;
        private final LocalDateTime expiryTime;

        public OtpDetails(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiryTime);
        }
    }
}
