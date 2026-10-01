package com.cfs.BMS.controller;


import com.cfs.BMS.dto.AuthResponse;
import com.cfs.BMS.dto.LoginRequest;
import com.cfs.BMS.dto.UserRequest;
import com.cfs.BMS.dto.SendOtpRequest;
import com.cfs.BMS.entity.User;
import com.cfs.BMS.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Endpoints for user registration, authentication, and profiles")
public class UserController {

    private final UserService userService;

    @PostMapping("/send-otp")
    @Operation(summary = "Send OTP to email", description = "Generates and sends a 6-digit OTP to the requested email address for verification")
    public ResponseEntity<Void> sendOtp(@RequestBody SendOtpRequest request)
    {
        userService.sendOtp(request.getEmail());
        return ResponseEntity.ok().build();
    }


    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account with the provided details")
    public ResponseEntity<User> register(@RequestBody UserRequest request, HttpServletResponse response)
    {
        AuthResponse authResponse = userService.register(request);
        
        ResponseCookie cookie = ResponseCookie.from("jwt", authResponse.getToken())
                .httpOnly(true)
                .secure(false) // Set to true in production over HTTPS
                .path("/")
                .maxAge(24 * 60 * 60) // 24 hours
                .sameSite("Lax")
                .build();
                
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(authResponse.getUser());
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user and returns their profile information")
    public ResponseEntity<User> login(@RequestBody LoginRequest request, HttpServletResponse response)
    {
        AuthResponse authResponse = userService.login(request);
        
        ResponseCookie cookie = ResponseCookie.from("jwt", authResponse.getToken())
                .httpOnly(true)
                .secure(false) // Set to true in production over HTTPS
                .path("/")
                .maxAge(24 * 60 * 60) // 24 hours
                .sameSite("Lax")
                .build();
                
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(authResponse.getUser());
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Clears the JWT HttpOnly session cookie")
    public ResponseEntity<Void> logout(HttpServletResponse response)
    {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0) // Expire immediately
                .sameSite("Lax")
                .build();
                
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieves a list of all registered users (Admin only recommended)")
    public ResponseEntity<List<User>> getAllUsers()
    {
        return  ResponseEntity.ok(userService.getAllUser());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieves detailed information about a specific user")
    public ResponseEntity<User> getUserById(@PathVariable Long id)
    {
        return  ResponseEntity.ok(userService.getUserById(id));
    }
}
