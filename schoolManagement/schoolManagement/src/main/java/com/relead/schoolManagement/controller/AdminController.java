package com.relead.schoolManagement.controller;

import com.relead.schoolManagement.dto.AdminLoginDTO;
import com.relead.schoolManagement.dto.AdminResponseDTO;
import com.relead.schoolManagement.entity.Admin;
import com.relead.schoolManagement.security.JwtUtil;
import com.relead.schoolManagement.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService service;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AdminResponseDTO> login(@RequestBody @Valid AdminLoginDTO dto) {
        String token = service.login(dto.getUsername(), dto.getPassword());
        AdminResponseDTO response = new AdminResponseDTO();
        response.setUsername(dto.getUsername());
        response.setToken(token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AdminResponseDTO> register(@RequestBody @Valid AdminLoginDTO dto) {
        // création de l’admin
        Admin admin = service.register(dto.getUsername(), dto.getPassword());

        // génération token JWT pour lui permettre accès immédiat
        String token = jwtUtil.generateToken(admin.getUsername());

        // préparation réponse DTO
        AdminResponseDTO response = new AdminResponseDTO();
        response.setUsername(admin.getUsername());
        response.setToken(token);

        return ResponseEntity.status(201).body(response);
    }


}

