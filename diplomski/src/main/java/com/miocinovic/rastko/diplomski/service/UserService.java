package com.miocinovic.rastko.diplomski.service;

import java.util.List;

import com.miocinovic.rastko.diplomski.dto.UserDetailsDto;
import com.miocinovic.rastko.diplomski.model.User;

public interface UserService {
	public User saveUser(User user);

	public UserDetailsDto getUserDetails(String username);

	public void setUserDetails(String username, UserDetailsDto detail);

	public void addContact(String userA, String userB);

	public List<UserDetailsDto> getContacts(String username);

	List<UserDetailsDto> getUserDetailsByLocation(String location);
}
