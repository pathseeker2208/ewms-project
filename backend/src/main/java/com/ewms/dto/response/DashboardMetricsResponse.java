package com.ewms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardMetricsResponse {
    private long totalProjects;
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private List<Map<String, Object>> projectProgress;
    private List<Map<String, Object>> statusBreakdown;
}
