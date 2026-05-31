package com.slms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;      // e.g., "APPROVED_LEAVE", "USER_LOGIN"
    private String actor;       // Who did it (e.g., email or user ID)
    private String details;     // Specific info (e.g., "Request ID 5 approved")

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    // Constructor for easy creation
    public AuditLog(String action, String actor, String details) {
        this.action = action;
        this.actor = actor;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    // Default constructor
    public AuditLog() {}
}