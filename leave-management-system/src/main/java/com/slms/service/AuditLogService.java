package com.slms.service;

import com.slms.entity.AuditLog;
import com.slms.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List; // Import List

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String action, String actor, String details) {
        AuditLog log = new AuditLog(action, actor, details);
        auditLogRepository.save(log);
        System.out.println("AUDIT: " + action + " by " + actor);
    }

    // NEW METHOD: To retrieve all logs for the dashboard
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }
}