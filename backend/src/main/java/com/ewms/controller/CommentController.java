package com.ewms.controller;

import com.ewms.entity.Comment;
import com.ewms.entity.Task;
import com.ewms.entity.User;
import com.ewms.repository.CommentRepository;
import com.ewms.repository.TaskRepository;
import com.ewms.repository.UserRepository;
import com.ewms.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    SimpMessagingTemplate messagingTemplate;

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Comment>> getCommentsByTask(@PathVariable("taskId") Long taskId) {
        return ResponseEntity.ok(commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId));
    }

    @PostMapping("/task/{taskId}")
    public ResponseEntity<?> addComment(@PathVariable("taskId") Long taskId, @RequestBody Comment comment) {
        Optional<Task> taskData = taskRepository.findById(taskId);
        if (taskData.isEmpty()) {
            return ResponseEntity.badRequest().body("Task not found");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<User> author = userRepository.findById(userDetails.getId());

        if (author.isPresent()) {
            comment.setTask(taskData.get());
            comment.setAuthor(author.get());
            comment.setCreatedAt(LocalDateTime.now());
            Comment savedComment = commentRepository.save(comment);

            // Notify via WebSocket
            messagingTemplate.convertAndSend("/topic/notifications", "New comment added to task: " + taskData.get().getTitle());

            return ResponseEntity.ok(savedComment);
        }

        return ResponseEntity.badRequest().body("User not found");
    }
}
