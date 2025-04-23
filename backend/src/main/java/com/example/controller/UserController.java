package com.example.controller;

import com.example.model.CoffeeTable;
import com.example.model.User;
import com.example.repository.TableRepository;
import com.example.repository.UserRepository;
import com.example.response.UserResponse; // Thêm import này
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

// Controller cho người dùng (USER)
@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserRepository userRepository;
    private final TableRepository tableRepository;

    public UserController(UserRepository userRepository, TableRepository tableRepository) {
        this.userRepository = userRepository;
        this.tableRepository = tableRepository;
    }

    // Lấy thông tin người dùng hiện tại
    @GetMapping("/current-user")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new UserResponse(user.getUsername(), user.getRole()));
    }

    // Lấy danh sách tất cả bàn
    @GetMapping("/tables")
    public ResponseEntity<?> getAllTables() {
        return ResponseEntity.ok(tableRepository.findAll());
    }

    // Tạo bàn mới (chức năng này có thể không cần thiết cho USER, nhưng giữ lại theo mã gốc)
    @PostMapping("/tables")
    @Transactional
    public ResponseEntity<?> createTable(@RequestBody CoffeeTable table) {
        return ResponseEntity.ok(tableRepository.save(table));
    }

    // Cập nhật trạng thái bàn (đặt bàn hoặc hủy đặt)
    @PutMapping("/tables/{id}")
    @Transactional
    public ResponseEntity<?> updateTable(
            @PathVariable Long id,
            @RequestBody CoffeeTable table,
            @AuthenticationPrincipal UserDetails userDetails) {
        CoffeeTable existing = tableRepository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.status(404).body("Table not found");

        // Nếu cập nhật trạng thái thành OCCUPIED (đặt bàn), lưu username của người đặt
        if ("OCCUPIED".equals(table.getStatus())) {
            existing.setBookedBy(userDetails.getUsername());
        } else if ("AVAILABLE".equals(table.getStatus())) {
            // Nếu hủy đặt, kiểm tra xem USER có phải là người đã đặt bàn không
            if (existing.getBookedBy() == null || !existing.getBookedBy().equals(userDetails.getUsername())) {
                return ResponseEntity.status(403).body("Bạn không có quyền hủy đặt bàn này!");
            }
            existing.setBookedBy(null); // Xóa thông tin người đặt khi hủy
        }

        existing.setTableNumber(table.getTableNumber());
        existing.setContent(table.getContent());
        existing.setStatus(table.getStatus());
        return ResponseEntity.ok(tableRepository.save(existing));
    }

    // Xóa bàn (chức năng này có thể không cần thiết cho USER, nhưng giữ lại theo mã gốc)
    @DeleteMapping("/tables/{id}")
    @Transactional
    public ResponseEntity<?> deleteTable(@PathVariable Long id) {
        tableRepository.deleteById(id);
        return ResponseEntity.ok("Table deleted");
    }
}