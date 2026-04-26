package com.ewms.controller;

import com.ewms.entity.Project;
import com.ewms.entity.User;
import com.ewms.entity.Role;
import com.ewms.repository.ProjectRepository;
import com.ewms.repository.UserRepository;
import com.ewms.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(item -> item.getAuthority())
                .orElse("ROLE_EMPLOYEE");

        if (role.equals("ROLE_ADMIN")) {
            return projectRepository.findAll();
        } else if (role.equals("ROLE_MANAGER")) {
            return projectRepository.findByOwnerId(userDetails.getId());
        } else {
            // Employee: Can view projects created by Managers
            return projectRepository.findByOwner_Role(Role.ROLE_MANAGER);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> createProject(@RequestBody Project project) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> owner = userRepository.findById(userDetails.getId());
        if (owner.isPresent()) {
            project.setOwner(owner.get());
            project.setCreatedAt(LocalDateTime.now());
            Project savedProject = projectRepository.save(project);
            return ResponseEntity.ok(savedProject);
        }
        return ResponseEntity.badRequest().body("User not found");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable("id") Long id) {
        Optional<Project> projectData = projectRepository.findById(id);
        return projectData.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Project> updateProject(@PathVariable("id") Long id, @RequestBody Project project) {
        Optional<Project> projectData = projectRepository.findById(id);

        if (projectData.isPresent()) {
            Project _project = projectData.get();
            _project.setName(project.getName());
            _project.setDescription(project.getDescription());
            _project.setDueDate(project.getDueDate());
            _project.setStatus(project.getStatus());
            return ResponseEntity.ok(projectRepository.save(_project));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteProject(@PathVariable("id") Long id) {
        try {
            projectRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
