package com.busbooking.dto;

import com.busbooking.entity.User;

import java.time.LocalDate;

public record RegisterRequest(
	String name,
	String email,
	String phone,
	String password,
	String address,
	User.Gender gender,
	LocalDate dateOfBirth) {
}
