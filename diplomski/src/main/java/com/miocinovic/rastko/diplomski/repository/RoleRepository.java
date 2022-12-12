package com.miocinovic.rastko.diplomski.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.miocinovic.rastko.diplomski.model.ERole;
import com.miocinovic.rastko.diplomski.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
	Optional<Role> findByName(ERole name);
}