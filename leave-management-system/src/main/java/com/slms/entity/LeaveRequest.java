package com.slms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "leave_type_id")
    private Long leaveTypeId;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    // --- NEW FIELD ADDED HERE ---
    @Column(name = "number_of_days")
    private Long numberOfDays;

    private String reason;
    private String status;

    @Column(name = "applied_date")
    private LocalDateTime appliedDate;

    // NOTE: Since you are using @Data from Lombok,
    // you technically do not need to manually write the Getters and Setters below.
    // Lombok generates them automatically at compile time.
    // However, I have left your manual code below as per your previous structure
    // (just adding the new setter for numberOfDays).

    // --- SETTERS ---

    public void setUserId(Long userId) { this.userId = userId; }
    public void setLeaveTypeId(Long leaveTypeId) { this.leaveTypeId = leaveTypeId; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setReason(String reason) { this.reason = reason; }
    public void setStatus(String status) { this.status = status; }
    public void setAppliedDate(LocalDateTime appliedDate) { this.appliedDate = appliedDate; }

    // NEW SETTER ADDED
    public void setNumberOfDays(Long numberOfDays) { this.numberOfDays = numberOfDays; }

    // --- GETTERS ---

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getLeaveTypeId() { return leaveTypeId; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public String getReason() { return reason; }
    public String getStatus() { return status; }
    public LocalDateTime getAppliedDate() { return appliedDate; }

    // NEW GETTER ADDED
    public Long getNumberOfDays() { return numberOfDays; }
}