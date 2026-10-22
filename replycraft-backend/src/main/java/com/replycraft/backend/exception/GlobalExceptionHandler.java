package com.replycraft.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.replycraft.backend.entity.ReplyResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(GeminiServiceException.class)
	public ResponseEntity<ReplyResponse> handlerGeminiException(GeminiServiceException ex)
	{
		ReplyResponse response = new ReplyResponse(
				false, 
				"The AI service is temporarily unavailable. Please try again in a minute. ");
		return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(response);
	}

}
