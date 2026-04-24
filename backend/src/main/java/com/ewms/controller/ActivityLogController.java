package com.ewms.controller;

import com.ewms.entity.ActivityLog;
import com.ewms.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/activity")
public class ActivityLogController {

    @Autowired
    ActivityLogRepository activityLogRepository;

    @GetMapping
    public ResponseEntity<List<ActivityLog>> getRecentActivity() {
        return ResponseEntity.ok(activityLogRepository.findTop50ByOrderByTimestampDesc());
    }
}
