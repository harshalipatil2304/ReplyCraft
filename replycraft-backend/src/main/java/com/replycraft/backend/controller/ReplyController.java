package com.replycraft.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.replycraft.backend.entity.ReplyRequest;
import com.replycraft.backend.entity.ReplyResponse;
import com.replycraft.backend.exception.GeminiServiceException;
import com.replycraft.backend.service.GeminiService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ReplyController {
	private final GeminiService geminiService;
	public ReplyController(GeminiService geminiService) {
		this.geminiService = geminiService;
	}


	@PostMapping("/api/reply")
	public ReplyResponse generateReply(@Valid @RequestBody ReplyRequest request)
	{
		try {
			String reply = geminiService.generateReply(request);
			return new ReplyResponse(true, reply);
		} catch (Exception e) {
			e.printStackTrace();
			throw new GeminiServiceException("Failed to genarate AI reply.", e);
		}	
	}
}
