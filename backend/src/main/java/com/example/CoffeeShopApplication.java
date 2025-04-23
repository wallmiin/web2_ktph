package com.example;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@SpringBootApplication
public class CoffeeShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(CoffeeShopApplication.class, args);
	}

	@Bean
	CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			try {
				System.out.println("Checking for admin account...");
				Optional<User> adminUser = userRepository.findByUsername("admin");
				System.out.println("Admin user found: " + adminUser.isPresent());
				if (adminUser.isEmpty()) {
					User rootAdmin = new User();
					rootAdmin.setUsername("admin");
					rootAdmin.setPassword(passwordEncoder.encode("123456"));
					rootAdmin.setRole("ADMIN");
					userRepository.save(rootAdmin);
					System.out.println("Admin account created with username: admin, password: 123456");
				} else {
					System.out.println("Admin account already exists, skipping creation.");
				}
			} catch (Exception e) {
				System.err.println("Error creating admin account: " + e.getMessage());
				e.printStackTrace();
			}
		};
	}
}