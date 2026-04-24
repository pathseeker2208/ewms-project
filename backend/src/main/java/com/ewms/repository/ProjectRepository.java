package com.ewms.repository;

import com.ewms.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwnerId(Long ownerId);
    
    @Query("SELECT DISTINCT p FROM Project p JOIN Task t ON t.project = p WHERE t.assignee.id = :userId")
    List<Project> findProjectsByAssigneeId(@Param("userId") Long userId);
}
