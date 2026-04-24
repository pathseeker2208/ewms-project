package com.ewms.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User assignee;

    private String type = "FEATURE"; // BUG, FEATURE, IMPROVEMENT
    
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH
    
    private String status = "TODO"; // TODO, IN_PROGRESS, REVIEW, DONE

    private LocalDate dueDate;

    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Position for kanban board ordering
    private Integer position = 0;
}
