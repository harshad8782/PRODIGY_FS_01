package com.example.secure_auth.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.secure_auth.DTO.AuthResponse;
import com.example.secure_auth.DTO.LoginRequest;
import com.example.secure_auth.DTO.RegisterRequest;
import com.example.secure_auth.service.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	@Autowired
	private AuthService authService;
	
	  @PostMapping("/register")
	    public ResponseEntity<AuthResponse>register(@RequestBody RegisterRequest request) {
	        return  ResponseEntity.ok(authService.register(request));
	    }

	    @PostMapping("/login")
	    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
	        return ResponseEntity.ok(authService.login(request));
	    }

}
