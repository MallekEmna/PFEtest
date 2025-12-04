package com.relead.schoolManagement.service;

import com.relead.schoolManagement.entity.Admin;
import com.relead.schoolManagement.repository.AdminRepository;
import com.relead.schoolManagement.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private AdminRepository repo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String login(String username, String password) {
        Admin admin = repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }
        return jwtUtil.generateToken(username);
    }

    public Admin register(String username, String password) {
        if(repo.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username déjà existant");
        }
        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        return repo.save(admin);
    }
}
