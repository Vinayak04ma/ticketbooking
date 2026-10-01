package com.cfs.BMS.service;

import com.cfs.BMS.dto.AuthResponse;
import com.cfs.BMS.dto.LoginRequest;
import com.cfs.BMS.dto.UserRequest;
import com.cfs.BMS.entity.User;
import com.cfs.BMS.repository.UserRepository;
import com.cfs.BMS.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;

    // Send OTP if email is not already registered
    public void sendOtp(String email) {
        if(userRepository.existsByEmail(email))
        {
            throw new RuntimeException("Email already exists: " + email);
        }
        otpService.sendOtp(email);
    }

    //register

    public AuthResponse register(UserRequest request)
    {
        if(userRepository.existsByEmail(request.getEmail()))
        {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        // Verify OTP
        if (request.getOtp() == null || request.getOtp().trim().isEmpty()) {
            throw new RuntimeException("OTP is required for verification");
        }
        boolean isOtpValid = otpService.validateOtp(request.getEmail(), request.getOtp());
        if (!isOtpValid) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .build();
        
        User savedUser = userRepository.save(user);
        String jwtToken = jwtService.generateToken(savedUser);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .user(savedUser)
                .build();
    }

    //login

    public AuthResponse login(LoginRequest request)
    {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));
        
        String jwtToken = jwtService.generateToken(user);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .user(user)
                .build();
    }

    public List<User> getAllUser(){
        return userRepository.findAll();
    }

    public User getUserById(Long id)
    {
        return userRepository.findById(id)
                .orElseThrow(()->new RuntimeException("User not found with email: "+id));
    }

}











