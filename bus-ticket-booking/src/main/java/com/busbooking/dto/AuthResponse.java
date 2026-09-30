package com.busbooking.dto;

public record AuthResponse(
	String token,
	Integer userId,
	String name,
	String email,
	String role) {
}
