package com.ewms.controller;

import com.ewms.entity.Attachment;
import com.ewms.entity.Task;
import com.ewms.entity.User;
import com.ewms.repository.AttachmentRepository;
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
@RequestMapping("/api/attachments")
public class AttachmentController {

    @Autowired
    AttachmentRepository attachmentRepository;

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    SimpMessagingTemplate messagingTemplate;

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Attachment>> getAttachmentsByTask(@PathVariable("taskId") Long taskId) {
        return ResponseEntity.ok(attachmentRepository.findByTaskIdOrderByUploadedAtDesc(taskId));
    }

    @PostMapping("/task/{taskId}")
    public ResponseEntity<?> addAttachment(@PathVariable("taskId") Long taskId, @RequestBody Attachment attachment) {
        Optional<Task> taskData = taskRepository.findById(taskId);
        if (taskData.isEmpty()) {
            return ResponseEntity.badRequest().body("Task not found");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<User> uploader = userRepository.findById(userDetails.getId());

        if (uploader.isPresent()) {
            attachment.setTask(taskData.get());
            attachment.setUploadedBy(uploader.get());
            attachment.setUploadedAt(LocalDateTime.now());
            Attachment savedAttachment = attachmentRepository.save(attachment);

            // Notify via WebSocket
            messagingTemplate.convertAndSend("/topic/notifications", "New attachment added to task: " + taskData.get().getTitle());

            return ResponseEntity.ok(savedAttachment);
        }

        return ResponseEntity.badRequest().body("User not found");
    }
}
