package com.ewms.service;

import com.ewms.entity.User;
import com.ewms.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthUserService {

    private final UserRepository userRepository;

    public AuthUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Returns the {@link User} entity of the currently authenticated principal.
     * The authentication principal is expected to be an instance of the
     * {@code org.springframework.security.core.userdetails.UserDetails}
     * implementation that contains the username (email) used for lookup.
     */
    public User getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in DB"));
    }
}
