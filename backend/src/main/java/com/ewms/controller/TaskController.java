package com.ewms.controller;

import com.ewms.entity.Project;
import com.ewms.entity.Task;
import com.ewms.entity.User;
import com.ewms.repository.ProjectRepository;
import com.ewms.repository.TaskRepository;
import com.ewms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable("projectId") Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/project/{projectId}")
    public ResponseEntity<?> createTask(@PathVariable("projectId") Long projectId, @RequestBody Task task) {
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isPresent()) {
            task.setProject(project.get());
            task.setCreatedAt(LocalDateTime.now());
            
            if (task.getAssignee() != null && task.getAssignee().getId() != null) {
                Optional<User> assignee = userRepository.findById(task.getAssignee().getId());
                assignee.ifPresent(task::setAssignee);
            }
            
            return ResponseEntity.ok(taskRepository.save(task));
        }
        return ResponseEntity.badRequest().body("Project not found");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable("id") Long id, @RequestBody Task taskDetails) {
        Optional<Task> taskData = taskRepository.findById(id);

        if (taskData.isPresent()) {
            Task _task = taskData.get();
            _task.setTitle(taskDetails.getTitle());
            _task.setDescription(taskDetails.getDescription());
            _task.setType(taskDetails.getType());
            _task.setPriority(taskDetails.getPriority());
            _task.setStatus(taskDetails.getStatus());
            _task.setDueDate(taskDetails.getDueDate());
            _task.setPosition(taskDetails.getPosition());

            if (taskDetails.getAssignee() != null && taskDetails.getAssignee().getId() != null) {
                Optional<User> assignee = userRepository.findById(taskDetails.getAssignee().getId());
                assignee.ifPresent(_task::setAssignee);
            }

            return ResponseEntity.ok(taskRepository.save(_task));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable("id") Long id) {
        try {
            taskRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
