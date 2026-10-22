package com.replycraft.backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.replycraft.backend.entity.ReplyRequest;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class GeminiService {

	private final WebClient webClient;
	private final ObjectMapper objectMapper;
	
	public GeminiService(WebClient webClient, ObjectMapper objectMapper) {
		this.webClient = webClient;
		this.objectMapper = objectMapper;
	}
	
	public String generateReply(ReplyRequest request) throws Exception{
		String apiKey = System.getenv("GEMINI_API_KEY");
		
		if(apiKey == null || apiKey.isBlank())
		{
			throw new IllegalStateException("GEMINI_API_KEY environment variable is missing.");
		}
		
		 String prompt = """
	                You are ReplyCraft, an assistant that writes natural,
	                personalized emails and messages.

	                Purpose: %s
	                Tone: %s
	                Length: %s
	                User details: %s

	                Write only the finished message.
	                Do not invent personal details.
	                """.formatted(
	                request.purpose(),
	                request.tone(),
	                request.length(),
	                request.details()
	        );
		 
		 Map<String, Object> body = Map.of(
				 "contents", List.of(
						 Map.of(
								 "parts",List.of(
										 Map.of("text",prompt))))
		);
		 
		
		 String response = webClient.post()
				 .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent")
				 .header("x-goog-api-key", apiKey)
				 .bodyValue(body)
				 .retrieve()
				 .bodyToMono(String.class)
				 .block();
		 
		 JsonNode json = objectMapper.readTree(response);
		 JsonNode textNode = json.at("/candidates/0/content/parts/0/text");
		 
		 if(textNode.isMissingNode() || textNode.asText().isBlank())
		 {
			 throw new IllegalStateException("Gemini returned an empty reply");
		 }
		 
		 return textNode.asText();
	}
	
}
