package com.slms.repository;

import com.slms.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    // We can add custom queries later if needed, e.g., find by date
}