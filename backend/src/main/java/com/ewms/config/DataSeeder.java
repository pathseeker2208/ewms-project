package com.ewms.config;

import com.ewms.entity.*;
import com.ewms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    AttachmentRepository attachmentRepository;

    @Autowired
    ActivityLogRepository activityLogRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.existsByEmail("abhijit@test.com")) {
            System.out.println("Data already seeded. Skipping...");
            return;
        }

        System.out.println("Seeding database with demo data...");

        // Create Admin
        User admin = createUser("Abhijit Behera", "abhijit@test.com", "admin123", Role.ROLE_ADMIN);

        // Create Managers
        User mgr1 = createUser("Rajesh Kumar Jena", "rajesh@test.com", "manager123", Role.ROLE_MANAGER);
        User mgr2 = createUser("Aditya Kiran Pati", "aditya@test.com", "manager123", Role.ROLE_MANAGER);

        // Create Employees
        User emp1 = createUser("Kunal KUmar", "kunal@test.com", "emp123", Role.ROLE_EMPLOYEE);
        User emp2 = createUser("Jeevanjyoti Sahoo", "jeevanjyoti@test.com", "emp123", Role.ROLE_EMPLOYEE);
        User emp3 = createUser("Sudeep Dehury", "sudeep@test.com", "emp123", Role.ROLE_EMPLOYEE);
        User emp4 = createUser("Akanshya Pradhan", "akanshya@test.com", "emp123", Role.ROLE_EMPLOYEE);
        User emp5 = createUser("Harish Sahoo", "harish@test.com", "emp123", Role.ROLE_EMPLOYEE);
        User emp6 = createUser("Laxmidhar Ojha", "laxmidhar@test.com", "emp123", Role.ROLE_EMPLOYEE);

        // Create Projects
        Project p1 = createProject("React Frontend Revamp", "Overhaul the UI using Material UI and React Context.", mgr1);
        Project p2 = createProject("Spring Boot Backend API", "Implement REST APIs, JWT Security, and WebSockets.", mgr2);

        // Create Tasks for P1
        Task t1 = createTask("Setup Vite Project", "Initialize React with Vite.", p1, emp1, "DONE", "FEATURE", "HIGH", 0);
        Task t2 = createTask("Implement Kanban Board", "Use react-beautiful-dnd for drag and drop.", p1, emp2, "IN_PROGRESS", "FEATURE", "HIGH", 0);
        Task t3 = createTask("Fix Login Styling", "Center the login form and add a logo.", p1, emp3, "TODO", "BUG", "MEDIUM", 0);
        
        // Create Tasks for P2
        Task t4 = createTask("Setup JWT Security", "Configure Spring Security with JWT filters.", p2, emp4, "DONE", "FEATURE", "HIGH", 0);
        Task t5 = createTask("WebSockets for Notifications", "Enable STOMP broker for real-time alerts.", p2, emp5, "REVIEW", "IMPROVEMENT", "MEDIUM", 0);
        Task t6 = createTask("Write Unit Tests", "Write JUnit tests for controllers.", p2, emp6, "TODO", "FEATURE", "LOW", 1);

        // Add Comments
        addComment(t2, emp2, "I am facing some issues with strict mode in dnd.");
        addComment(t2, mgr1, "Try using @hello-pangea/dnd instead.");
        addComment(t5, emp5, "WebSocket configuration is complete. Needs review.");

        // Add Attachments
        addAttachment(t4, emp4, "Security Docs", "https://spring.io/projects/spring-security");
        addAttachment(t2, mgr1, "DND Guide", "https://github.com/hello-pangea/dnd");

        // Add Activity Logs
        logActivity(admin, "Created", "User Accounts", "Generated demo users.");
        logActivity(mgr1, "Created", "Project", "Created React Frontend Revamp project.");
        logActivity(emp4, "Completed", "Task", "Setup JWT Security task marked as done.");

        System.out.println("Database seeding completed successfully!");
    }

    private User createUser(String name, String email, String password, Role role) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setLastActivity(LocalDateTime.now().minusDays((long)(Math.random() * 5)));
        return userRepository.save(user);
    }

    private Project createProject(String name, String description, User owner) {
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setOwner(owner);
        project.setStatus("IN_PROGRESS");
        project.setDueDate(LocalDate.now().plusDays(14));
        project.setCreatedAt(LocalDateTime.now().minusDays(2));
        return projectRepository.save(project);
    }

    private Task createTask(String title, String description, Project project, User assignee, String status, String type, String priority, int position) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setProject(project);
        task.setAssignee(assignee);
        task.setStatus(status);
        task.setType(type);
        task.setPriority(priority);
        task.setPosition(position);
        task.setDueDate(LocalDate.now().plusDays(7));
        task.setCreatedAt(LocalDateTime.now().minusDays(1));
        return taskRepository.save(task);
    }

    private void addComment(Task task, User author, String text) {
        Comment comment = new Comment();
        comment.setTask(task);
        comment.setAuthor(author);
        comment.setText(text);
        comment.setCreatedAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    private void addAttachment(Task task, User uploader, String fileName, String fileUrl) {
        Attachment attachment = new Attachment();
        attachment.setTask(task);
        attachment.setUploadedBy(uploader);
        attachment.setFileName(fileName);
        attachment.setFileUrl(fileUrl);
        attachment.setUploadedAt(LocalDateTime.now());
        attachmentRepository.save(attachment);
    }

    private void logActivity(User user, String action, String entityType, String description) {
        ActivityLog log = new ActivityLog();
        log.setUser(user);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setDescription(description);
        log.setTimestamp(LocalDateTime.now());
        activityLogRepository.save(log);
    }
}
