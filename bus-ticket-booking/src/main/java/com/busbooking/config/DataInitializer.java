package com.busbooking.config;

import com.busbooking.entity.User;
import com.busbooking.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;

@Configuration
public class DataInitializer {

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @Value("${app.admin.phone:}")
    private String adminPhone;

    @Bean
    public CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (!StringUtils.hasText(adminEmail)
                    || !StringUtils.hasText(adminPassword)
                    || !StringUtils.hasText(adminPhone)) {
                return;
            }

            User admin = userRepository.findByEmail(adminEmail).orElseGet(User::new);
            if (admin.getUserId() == null) {
                admin.setName("System Admin");
                admin.setPhone(adminPhone);
            }

            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
        };
    }
}
