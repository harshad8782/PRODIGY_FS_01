package com.example.secure_auth.repository;


import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.secure_auth.entity.User;
import com.example.secure_auth.enums.Role;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    long countByRole(Role role);
    List<User> findByRole(com.example.secure_auth.enums.Role role);
    List<User> findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(String email, String name);

}
