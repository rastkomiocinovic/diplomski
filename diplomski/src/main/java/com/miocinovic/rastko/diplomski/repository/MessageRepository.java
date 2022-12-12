package com.miocinovic.rastko.diplomski.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.miocinovic.rastko.diplomski.model.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
	@Query("SELECT m FROM Message m WHERE m.receiverName = ?1 and m.senderName = ?2 or m.senderName = ?1 and m.receiverName = ?2")
	public List<Message> findAllMessagesBetween(String username1, String username2);
}
