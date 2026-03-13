package com.slms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Maps to the 'actor_id' column in MySQL
    @Column(name = "actor_id")
    private Long actorId;

    private String action;

    private LocalDateTime timestamp;

    // --- MANUAL SETTERS TO FIX THE ERROR ---
    public void setActorId(Long actorId) {
        this.actorId = actorId;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}