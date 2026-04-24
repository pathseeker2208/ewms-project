package com.ewms.controller;

import com.ewms.dto.response.DashboardMetricsResponse;
import com.ewms.entity.Project;
import com.ewms.entity.Task;
import com.ewms.repository.ProjectRepository;
import com.ewms.repository.TaskRepository;
import com.ewms.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    TaskRepository taskRepository;

    @GetMapping("/metrics")
    public ResponseEntity<DashboardMetricsResponse> getMetrics() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();
        
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(item -> item.getAuthority())
                .orElse("ROLE_EMPLOYEE");

        DashboardMetricsResponse response = new DashboardMetricsResponse();
        List<Project> visibleProjects;
        List<Task> relevantTasks;

        if (role.equals("ROLE_ADMIN")) {
            visibleProjects = projectRepository.findAll();
            relevantTasks = taskRepository.findAll();
            response.setTotalProjects(visibleProjects.size());
            response.setTotalTasks(relevantTasks.size());
            response.setCompletedTasks(taskRepository.findAll().stream().filter(t -> "DONE".equals(t.getStatus())).count());
            response.setPendingTasks(relevantTasks.size() - response.getCompletedTasks());
        } else if (role.equals("ROLE_MANAGER")) {
            visibleProjects = projectRepository.findByOwnerId(userId);
            relevantTasks = taskRepository.findByProjectOwnerId(userId);
            response.setTotalProjects(visibleProjects.size());
            response.setTotalTasks(relevantTasks.size());
            response.setCompletedTasks(taskRepository.countByProjectOwnerIdAndStatus(userId, "DONE"));
            response.setPendingTasks(relevantTasks.size() - response.getCompletedTasks());
        } else {
            visibleProjects = projectRepository.findProjectsByAssigneeId(userId);
            relevantTasks = taskRepository.findByAssigneeId(userId);
            response.setTotalProjects(visibleProjects.size());
            response.setTotalTasks(relevantTasks.size());
            response.setCompletedTasks(taskRepository.countByAssigneeIdAndStatus(userId, "DONE"));
            response.setPendingTasks(relevantTasks.size() - response.getCompletedTasks());
        }

        // Project Progress for chart
        List<Map<String, Object>> progress = new ArrayList<>();
        for (Project p : visibleProjects) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", p.getName());
            List<Task> projectTasks = taskRepository.findByProjectId(p.getId());
            map.put("Tasks", projectTasks.size());
            map.put("Completed", projectTasks.stream().filter(t -> "DONE".equals(t.getStatus())).count());
            progress.add(map);
        }
        response.setProjectProgress(progress);

        // Status Breakdown for pie chart
        List<Map<String, Object>> breakdown = new ArrayList<>();
        Map<String, Long> statusCounts = new HashMap<>();
        for (Task t : relevantTasks) {
            statusCounts.put(t.getStatus(), statusCounts.getOrDefault(t.getStatus(), 0L) + 1);
        }
        
        statusCounts.forEach((status, count) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", status);
            map.put("value", count);
            breakdown.add(map);
        });
        response.setStatusBreakdown(breakdown);

        return ResponseEntity.ok(response);
    }
}
