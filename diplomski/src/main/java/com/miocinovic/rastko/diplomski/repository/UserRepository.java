package com.miocinovic.rastko.diplomski.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.miocinovic.rastko.diplomski.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByUsername(String username);

	List<User> findByLocationContains(String location);

	Boolean existsByUsername(String username);

	Boolean existsByEmail(String email);
}