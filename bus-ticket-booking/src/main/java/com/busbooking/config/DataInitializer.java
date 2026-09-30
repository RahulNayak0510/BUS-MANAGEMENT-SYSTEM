package com.busbooking.config;

import com.busbooking.entity.User;
import com.busbooking.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (!userRepository.existsByEmail("admin@busbooking.com")) {

                User admin = new User();

                admin.setName("System Admin");
                admin.setEmail("admin@busbooking.com");
                admin.setPhone("9999999999");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole(User.Role.ADMIN);
                admin.setAddress("Bangalore");

                userRepository.save(admin);

                System.out.println("====================================");
                System.out.println("ADMIN ACCOUNT CREATED");
                System.out.println("Email: admin@busbooking.com");
                System.out.println("Password: Admin@123");
                System.out.println("====================================");
            }
        };
    }
}
