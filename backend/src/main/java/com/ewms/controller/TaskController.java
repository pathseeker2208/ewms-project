package com.ewms.controller;

import com.ewms.entity.Project;
import com.ewms.entity.Task;
import com.ewms.entity.User;
import com.ewms.repository.ProjectRepository;
import com.ewms.repository.TaskRepository;
import com.ewms.repository.UserRepository;
import com.ewms.service.AuthUserService;
import com.ewms.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AuthUserService authUserService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable("projectId") Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/project/{projectId}")
    public ResponseEntity<?> createTask(@PathVariable("projectId") Long projectId, @RequestBody Task task) {
        // Any logged‑in user may add a task to a project. Ownership will be set to the current user if not specified.
        var currentUser = authUserService.getCurrentUser();
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isPresent()) {
            task.setProject(project.get());
            task.setCreatedAt(LocalDateTime.now());
            // If no assignee supplied, default to creator (self‑assigned)
            if (task.getAssignee() == null || task.getAssignee().getId() == null) {
                task.setAssignee(currentUser);
            } else {
                // Ensure provided assignee exists
                Optional<User> assignee = userRepository.findById(task.getAssignee().getId());
                assignee.ifPresent(task::setAssignee);
            }
            return ResponseEntity.ok(taskRepository.save(task));
        }
        return ResponseEntity.badRequest().body("Project not found");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable("id") Long id, @RequestBody Task taskDetails) {
        var currentUser = authUserService.getCurrentUser();
        Optional<Task> taskData = taskRepository.findById(id);

        if (taskData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Task existing = taskData.get();

        // Permission logic:
        // • ADMIN can update any task.
        // • MANAGER can update a task only if the assignee is NOT an EMPLOYEE.
        // • EMPLOYEE can update ONLY their own task.
        Role userRole = currentUser.getRole();
        if (userRole == Role.ROLE_ADMIN) {
            // allowed
        } else if (userRole == Role.ROLE_MANAGER) {
            if (existing.getAssignee() != null && existing.getAssignee().getRole() == Role.ROLE_EMPLOYEE) {
                return ResponseEntity.status(403).body(null);
            }
        } else { // EMPLOYEE
            if (existing.getAssignee() == null || !existing.getAssignee().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body(null);
            }
        }

        // Apply updates (allow changing allowed fields)
        existing.setTitle(taskDetails.getTitle());
        existing.setDescription(taskDetails.getDescription());
        existing.setType(taskDetails.getType());
        existing.setPriority(taskDetails.getPriority());
        existing.setStatus(taskDetails.getStatus());
        existing.setDueDate(taskDetails.getDueDate());
        existing.setPosition(taskDetails.getPosition());

        if (taskDetails.getAssignee() != null && taskDetails.getAssignee().getId() != null) {
            Optional<User> assignee = userRepository.findById(taskDetails.getAssignee().getId());
            assignee.ifPresent(existing::setAssignee);
        }

        return ResponseEntity.ok(taskRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTask(@PathVariable("id") Long id) {
        try {
            taskRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Admin endpoint to reassign any task
    @PostMapping("/{id}/reassign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> reassignTask(@PathVariable("id") Long id, @RequestParam Long newAssigneeId) {
        Optional<Task> taskOpt = taskRepository.findById(id);
        Optional<User> userOpt = userRepository.findById(newAssigneeId);
        if (taskOpt.isPresent() && userOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setAssignee(userOpt.get());
            taskRepository.save(task);
            return ResponseEntity.ok(task);
        }
        return ResponseEntity.badRequest().body("Task or user not found");
    }
}
