package com.miocinovic.rastko.diplomski.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class Message {
	@Id
	@GeneratedValue
	private int id;
	private String senderName;
	private String receiverName;
	@Size(max = 50000000)
	private String message;
	private String date;
	private Status status;
}
