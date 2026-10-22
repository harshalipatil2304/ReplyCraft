package com.replycraft.backend.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ReplyRequest(
		@NotBlank(message= "Purpose is required.")
		@Pattern(regexp = "Job application|Recruiter follow-up|Thank-you email|LinkedIn message",
				 message = "Please select a valid purpose.")
		String purpose,
		@NotBlank(message = "Tone is required.")
		@Pattern(regexp = "Professional|Friendly|Confident",
				 message = "Plase select a valid tone")
		String tone,
		@NotBlank(message = "Length is required")
		@Pattern(regexp = "Short|Medium|Detailed",
				message = "Please selct a valid message length")
		String length,
		@NotBlank(message = "Details cannot be empty")
		@Size(max=3000, message="Details cannot exceed 30000 characters.")
		String details
) {}
