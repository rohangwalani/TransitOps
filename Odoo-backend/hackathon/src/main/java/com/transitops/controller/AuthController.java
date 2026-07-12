package com.transitops.controller;

import com.transitops.dto.request.ChangePasswordRequest;
import com.transitops.dto.request.LoginRequest;
import com.transitops.dto.request.SignupRequest;
import com.transitops.dto.response.JwtResponse;
import com.transitops.dto.response.MessageResponse;
import com.transitops.entity.User;
import com.transitops.enums.RoleType;
import com.transitops.exception.DuplicateResourceException;
import com.transitops.repository.UserRepository;
import com.transitops.security.jwt.JwtUtils;
import com.transitops.security.services.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Login and Registration APIs")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    @Operation(summary = "Login and get JWT token")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Login attempt for email: {}", loginRequest.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getName(), userDetails.getEmail(), roles));
    }

    @PostMapping("/signup")
    @Operation(summary = "Register a new user")
    public ResponseEntity<MessageResponse> signup(@Valid @RequestBody SignupRequest signupRequest) {
        log.info("Signup attempt for email: {}", signupRequest.getEmail());

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new DuplicateResourceException("User", "email", signupRequest.getEmail());
        }

        Set<RoleType> roles = new HashSet<>();
        if (signupRequest.getRoles() == null || signupRequest.getRoles().isEmpty()) {
            roles.add(RoleType.ROLE_DRIVER);
        } else {
            roles.addAll(signupRequest.getRoles());
        }

        User user = User.builder()
                .name(signupRequest.getName())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .phone(signupRequest.getPhone())
                .roles(roles)
                .build();

        userRepository.save(user);
        log.info("User registered successfully: {}", signupRequest.getEmail());
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change user password")
    public ResponseEntity<MessageResponse> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        log.info("Password change attempt for email: {}", currentEmail);

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Incorrect old password!"));
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed successfully for email: {}", currentEmail);
        return ResponseEntity.ok(new MessageResponse("Password changed successfully!"));
    }
}
