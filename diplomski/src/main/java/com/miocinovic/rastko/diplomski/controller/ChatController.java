package com.miocinovic.rastko.diplomski.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import com.miocinovic.rastko.diplomski.model.Message;
import com.miocinovic.rastko.diplomski.repository.MessageRepository;

@Controller
public class ChatController {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@Autowired
	private MessageRepository messageRepo;

	@MessageMapping("/message")
	public Message receiveMessage(@Payload Message message) {
		simpMessagingTemplate.convertAndSendToUser(message.getReceiverName() + '-' + message.getSenderName(),
				"/private", message);
		messageRepo.save(message);
		return message;
	}

	@CrossOrigin
	@ResponseBody
	@GetMapping("/message/{usernameA}/{usernameB}")
	public List<Message> getHistory(@PathVariable("usernameA") String usernameA,
			@PathVariable("usernameB") String usernameB) {
		return messageRepo.findAllMessagesBetween(usernameA, usernameB);
	}
}
