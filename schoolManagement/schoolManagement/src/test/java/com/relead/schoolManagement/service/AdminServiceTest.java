package com.relead.schoolManagement.service;

import com.relead.schoolManagement.entity.Admin;
import com.relead.schoolManagement.repository.AdminRepository;
import com.relead.schoolManagement.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminServiceTest {

    @Mock
    private AdminRepository repo;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AdminService adminService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoginSuccess() {
        Admin admin = new Admin();
        admin.setUsername("admin1");
        admin.setPassword("hashedPassword");

        when(repo.findByUsername("admin1")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);
        when(jwtUtil.generateToken("admin1")).thenReturn("token123");

        String token = adminService.login("admin1", "password123");

        assertEquals("token123", token);
    }

    @Test
    void testLoginFailWrongPassword() {
        Admin admin = new Admin();
        admin.setUsername("admin1");
        admin.setPassword("hashedPassword");

        when(repo.findByUsername("admin1")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("wrong", "hashedPassword")).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                adminService.login("admin1", "wrong"));
        assertEquals("Mot de passe incorrect", exception.getMessage());
    }

    @Test
    void testRegisterSuccess() {
        when(repo.findByUsername("newAdmin")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass123")).thenReturn("hashedPass");

        Admin savedAdmin = new Admin();
        savedAdmin.setUsername("newAdmin");
        savedAdmin.setPassword("hashedPass");

        when(repo.save(any(Admin.class))).thenReturn(savedAdmin);

        Admin result = adminService.register("newAdmin", "pass123");

        assertEquals("newAdmin", result.getUsername());
        assertEquals("hashedPass", result.getPassword());
    }

    @Test
    void testRegisterFailDuplicateUsername() {
        when(repo.findByUsername("admin1")).thenReturn(Optional.of(new Admin()));

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                adminService.register("admin1", "pass123"));
        assertEquals("Username déjà existant", exception.getMessage());
    }
}
