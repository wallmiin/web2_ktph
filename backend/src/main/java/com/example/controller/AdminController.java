package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.model.CoffeeTable;
import com.example.model.User;
import com.example.repository.TableRepository;
import com.example.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminController {

    private final UserRepository userRepository;
    private final TableRepository tableRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    public AdminController(UserRepository userRepository, TableRepository tableRepository,
                           org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tableRepository = tableRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("Not authenticated");
    }

    @PostMapping("/users")
    @Transactional
    public ResponseEntity<?> createUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}")
    @Transactional
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        User existing = userRepository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.status(404).body("User not found");
        existing.setUsername(user.getUsername());
        existing.setRole(user.getRole());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return ResponseEntity.ok(userRepository.save(existing));
    }

    @DeleteMapping("/users/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted");
    }

    @PostMapping("/tables")
    @Transactional
    public ResponseEntity<?> createTable(@RequestBody CoffeeTable table) {
        // Nếu ADMIN tạo bàn với trạng thái OCCUPIED, có thể để bookedBy là null
        if ("OCCUPIED".equals(table.getStatus()) && table.getBookedBy() == null) {
            table.setBookedBy("ADMIN"); // Ghi nhận rằng bàn được đặt bởi ADMIN
        }
        return ResponseEntity.ok(tableRepository.save(table));
    }

    @GetMapping("/tables")
    public ResponseEntity<?> getAllTables() {
        return ResponseEntity.ok(tableRepository.findAll());
    }

    @PutMapping("/tables/{id}")
    @Transactional
    public ResponseEntity<?> updateTable(@PathVariable Long id, @RequestBody CoffeeTable table) {
        CoffeeTable existing = tableRepository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.status(404).body("Table not found");
        existing.setTableNumber(table.getTableNumber());
        existing.setContent(table.getContent());
        existing.setStatus(table.getStatus());
        if ("OCCUPIED".equals(table.getStatus()) && table.getBookedBy() == null) {
            existing.setBookedBy("ADMIN"); // Ghi nhận rằng bàn được đặt bởi ADMIN
        } else if ("AVAILABLE".equals(table.getStatus())) {
            existing.setBookedBy(null); // Xóa thông tin người đặt khi hủy
        }
        return ResponseEntity.ok(tableRepository.save(existing));
    }

    @DeleteMapping("/tables/{id}")
    @Transactional
    public ResponseEntity<?> deleteTable(@PathVariable Long id) {
        tableRepository.deleteById(id);
        return ResponseEntity.ok("Table deleted");
    }
}