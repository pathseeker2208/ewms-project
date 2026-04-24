package com.ewms.repository;

import com.ewms.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByAssigneeId(Long assigneeId);
    
    @Query("SELECT t FROM Task t WHERE t.project.owner.id = :ownerId")
    List<Task> findByProjectOwnerId(@Param("ownerId") Long ownerId);

    long countByAssigneeId(Long assigneeId);
    long countByAssigneeIdAndStatus(Long assigneeId, String status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.owner.id = :ownerId")
    long countByProjectOwnerId(@Param("ownerId") Long ownerId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.owner.id = :ownerId AND t.status = :status")
    long countByProjectOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") String status);
}
