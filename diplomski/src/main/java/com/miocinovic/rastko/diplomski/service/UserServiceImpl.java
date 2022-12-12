package com.miocinovic.rastko.diplomski.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.miocinovic.rastko.diplomski.dto.UserDetailsDto;
import com.miocinovic.rastko.diplomski.model.User;
import com.miocinovic.rastko.diplomski.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	UserRepository userRepo;

	public UserServiceImpl() {
	}

	@Override
	public User saveUser(User user) {
		return userRepo.save(user);
	}

	@Override
	public UserDetailsDto getUserDetails(String username) {
		UserDetailsDto details = null;
		Optional<User> user = userRepo.findByUsername(username);
		if (user.isPresent()) {
			details = new UserDetailsDto();
			details.setUsername(username);
			details.setFirstname(user.get().getFirstname());
			details.setLastname(user.get().getLastname());
			details.setAddress(user.get().getAddress());
			details.setCity(user.get().getCity());
			details.setCountry(user.get().getCountry());
			details.setPhone(user.get().getPhone());
			details.setLocation(user.get().getLocation());
			details.setLng(user.get().getLng());
			details.setLat(user.get().getLat());
			details.setZoom(user.get().getZoom());
			details.setBio(user.get().getBio());
			details.setIsSeller(user.get().getIsSeller());
			details.setProfilePicture(user.get().getProfilePicture());
		}
		return details;
	}

	@Override
	public List<UserDetailsDto> getUserDetailsByLocation(String location) {
		List<UserDetailsDto> detailsList = new LinkedList<>();
		List<User> users = userRepo.findByLocationContains(location);
		for (User user : users) {
			UserDetailsDto details = new UserDetailsDto();
			details.setUsername(user.getUsername());
			details.setFirstname(user.getFirstname());
			details.setLastname(user.getLastname());
			details.setAddress(user.getAddress());
			details.setCity(user.getCity());
			details.setCountry(user.getCountry());
			details.setPhone(user.getPhone());
			details.setLocation(user.getLocation());
			details.setLng(user.getLng());
			details.setLat(user.getLat());
			details.setZoom(user.getZoom());
			details.setBio(user.getBio());
			details.setIsSeller(user.getIsSeller());
			details.setProfilePicture(user.getProfilePicture());
			detailsList.add(details);
		}
		return detailsList;
	}

	@Override
	public void setUserDetails(String username, UserDetailsDto details) {
		Optional<User> user = userRepo.findByUsername(username);
		if (user.isPresent()) {
			user.get().setAddress(details.getAddress());
			user.get().setCity(details.getCity());
			user.get().setCountry(details.getCountry());
			user.get().setPhone(details.getPhone());
			user.get().setLocation(details.getLocation());
			user.get().setLng(details.getLng());
			user.get().setLat(details.getLat());
			user.get().setZoom(details.getZoom());
			user.get().setBio(details.getBio());
			user.get().setIsSeller(details.getIsSeller());
			user.get().setProfilePicture(details.getProfilePicture());
			userRepo.save(user.get());
		}
	}

	@Override
	public void addContact(String usernameA, String usernameB) {
		Optional<User> userA = userRepo.findByUsername(usernameA);
		Optional<User> userB = userRepo.findByUsername(usernameB);
		if (userA.isPresent() && userB.isPresent()) {
			userA.get().getContacts().add(userB.get());
			userB.get().getContacts().add(userA.get());
			userRepo.save(userA.get());
			userRepo.save(userB.get());
		}
	}

	@Override
	public List<UserDetailsDto> getContacts(String username) {
		Optional<User> user = userRepo.findByUsername(username);
		List<UserDetailsDto> detailsList = new LinkedList<>();
		if (user.isPresent()) {
			for (User contact : user.get().getContacts()) {
				UserDetailsDto details = new UserDetailsDto();
				details.setUsername(contact.getUsername());
				details.setFirstname(contact.getFirstname());
				details.setLastname(contact.getLastname());
				details.setAddress(contact.getAddress());
				details.setCity(contact.getCity());
				details.setCountry(contact.getCountry());
				details.setPhone(contact.getPhone());
				details.setLocation(contact.getLocation());
				details.setLng(contact.getLng());
				details.setLat(contact.getLat());
				details.setZoom(contact.getZoom());
				details.setBio(contact.getBio());
				details.setIsSeller(contact.getIsSeller());
				details.setProfilePicture(contact.getProfilePicture());
				detailsList.add(details);
			}
			userRepo.save(user.get());
		}
		return detailsList;
	}

}
