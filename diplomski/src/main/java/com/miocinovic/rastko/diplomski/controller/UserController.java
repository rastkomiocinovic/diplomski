package com.miocinovic.rastko.diplomski.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miocinovic.rastko.diplomski.dto.UserDetailsDto;
import com.miocinovic.rastko.diplomski.service.UserService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/user")
public class UserController {
	@Autowired
	private UserService userService;

	@GetMapping("/{username}")
	public UserDetailsDto get(@PathVariable(name = "username") String username) {
		return userService.getUserDetails(username);
	}

	@GetMapping("/location/{location}")
	public List<UserDetailsDto> searchByLocation(@PathVariable(name = "location") String location) {
		return userService.getUserDetailsByLocation(location);
	}

	@GetMapping("/location/")
	public List<UserDetailsDto> getAll() {
		return userService.getUserDetailsByLocation("");
	}

	@PutMapping("/{username}")
	public void put(@PathVariable(name = "username") String username, @RequestBody UserDetailsDto details) {
		userService.setUserDetails(username, details);
	}

	@PutMapping("/{usernameA}/contacts")
	public void putContact(@PathVariable(name = "usernameA") String usernameA, @RequestBody UserDetailsDto userB) {
		userService.addContact(usernameA, userB.getUsername());
	}

	@GetMapping("/{username}/contacts")
	public List<UserDetailsDto> getContacts(@PathVariable(name = "username") String username) {
		return userService.getContacts(username);
	}
}
