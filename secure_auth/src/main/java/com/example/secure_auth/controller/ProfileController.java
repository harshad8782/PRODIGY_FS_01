package com.example.secure_auth.controller;

import com.example.secure_auth.DTO.PasswordChangeRequest;
import com.example.secure_auth.DTO.ProfileUpdateRequest;
import com.example.secure_auth.entity.User;
import com.example.secure_auth.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000") // Ensure this matches your frontend URL
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("User not authenticated");
        }
        // Assuming the principal is the UserDetails object, and it contains the user ID
        // You might need to cast or adjust this based on your UserDetails implementation
        // For simplicity, let's assume the email is the principal and we can find the user by email
        String userEmail = authentication.getName(); // This usually returns the username/email
        User user = profileService.userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in DB"));
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<User> getUserProfile() {
        Long userId = getAuthenticatedUserId();
        User user = profileService.getUserProfile(userId);
        // Mask sensitive data if necessary before sending to frontend
        user.setPasswordHash(null); // Do not send password hash to frontend
        user.setName(null); // Remove deprecated name field
        return ResponseEntity.ok(user);
    }

    @PutMapping
    public ResponseEntity<Map<String, String>> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        Long userId = getAuthenticatedUserId();
        profileService.updateProfile(userId, request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Profile updated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        Long userId = getAuthenticatedUserId();
        profileService.changePassword(userId, request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password changed successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> deleteProfile() {
        Long userId = getAuthenticatedUserId();
        profileService.deleteUser(userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Account deleted successfully");
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}
