package com.miocinovic.rastko.diplomski.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.miocinovic.rastko.diplomski.model.Message;
import com.miocinovic.rastko.diplomski.repository.MessageRepository;

public class ChatServiceImpl implements ChatService {

	@Autowired
	private MessageRepository messageRepo;

	public List<Message> getChatHistory(String username1, String username2) {
		return messageRepo.findAllMessagesBetween(username1, username2);
	}
}
