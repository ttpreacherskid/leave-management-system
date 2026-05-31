package com.slms.service;

import com.slms.entity.LeaveRequest;
import com.slms.entity.User;
import com.slms.repository.LeaveRequestRepository;
import com.slms.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService; // 1. Add AuditLogService

    // 2. Update Constructor
    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository, UserRepository userRepository, NotificationService notificationService, AuditLogService auditLogService) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public LeaveRequest applyForLeave(LeaveRequest request) {
        long daysRequested = calculateBusinessDays(request.getStartDate(), request.getEndDate());
        request.setNumberOfDays(daysRequested);
        request.setStatus("PENDING");

        // 3. Log the action
        auditLogService.log("APPLIED_LEAVE", "USER_ID: " + request.getUserId(), "Applied for " + daysRequested + " days.");

        return leaveRequestRepository.save(request);
    }

    public void fixOldRecords() {
        List<LeaveRequest> allRequests = leaveRequestRepository.findAll();
        for (LeaveRequest req : allRequests) {
            if (req.getNumberOfDays() == null && req.getStartDate() != null && req.getEndDate() != null) {
                long days = calculateBusinessDays(req.getStartDate(), req.getEndDate());
                req.setNumberOfDays(days);
                leaveRequestRepository.save(req);
            }
        }
    }

    public List<LeaveRequest> getPendingRequests() {
        return leaveRequestRepository.findByStatus("PENDING");
    }

    public LeaveRequest approveLeave(Long id) {
        LeaveRequest request = leaveRequestRepository.findById(id).orElseThrow();
        request.setStatus("APPROVED");

        // 4. Log the action
        auditLogService.log("APPROVED_LEAVE", "MANAGER", "Approved request ID: " + id);

        sendEmailNotification(request, "APPROVED");
        return leaveRequestRepository.save(request);
    }

    public LeaveRequest rejectLeave(Long id) {
        LeaveRequest request = leaveRequestRepository.findById(id).orElseThrow();
        request.setStatus("REJECTED");

        // 5. Log the action
        auditLogService.log("REJECTED_LEAVE", "MANAGER", "Rejected request ID: " + id);

        sendEmailNotification(request, "REJECTED");
        return leaveRequestRepository.save(request);
    }

    // Helper method to send email
    private void sendEmailNotification(LeaveRequest request, String status) {
        if (request.getUserId() != null) {
            Optional<User> userOptional = userRepository.findById(request.getUserId());
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                String email = user.getEmail();

                if (email != null) {
                    notificationService.sendLeaveStatusNotification(email, status, request.getId());
                }
            }
        }
    }

    private long calculateBusinessDays(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) return 0;
        if (endDate.isBefore(startDate)) return 0;

        long totalDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        long businessDays = 0;

        LocalDate current = startDate;
        for (int i = 0; i < totalDays; i++) {
            DayOfWeek day = current.getDayOfWeek();
            if (day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY) {
                businessDays++;
            }
            current = current.plusDays(1);
        }
        return businessDays;
    }
}