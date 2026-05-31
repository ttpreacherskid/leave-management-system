package com.slms.controller;

import com.slms.entity.User;
import com.slms.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 1. Create User (Auto-Generate ID & Encrypt Password)
    @PostMapping
    public User createUser(@RequestBody User user) {
        // Auto-Generate Employee ID
        if (user.getEmployeeId() == null || user.getEmployeeId().isEmpty()) {
            Long count = userRepository.count();
            String newId = "EMP-" + (count + 1);
            user.setEmployeeId(newId);
        }

        // ENCRYPT PASSWORD
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
        }

        return userRepository.save(user);
    }

    // 2. Get All Users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 3. Update User
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (userDetails.getDepartment() != null) user.setDepartment(userDetails.getDepartment());
        if (userDetails.getRoleId() != null) user.setRoleId(userDetails.getRoleId());

        // Optional: Update password if provided
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        return userRepository.save(user);
    }

    // 4. Delete User
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}