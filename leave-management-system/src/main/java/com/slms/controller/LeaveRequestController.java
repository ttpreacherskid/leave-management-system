package com.slms.controller;

import com.slms.entity.AuditLog;
import com.slms.entity.LeaveRequest;
import com.slms.repository.LeaveRequestRepository;
import com.slms.repository.UserRepository;
import com.slms.service.AnalyticsService;
import com.slms.service.AuditLogService;
import com.slms.service.LeaveRequestService;
import org.springframework.web.bind.annotation.*;

import java.io.StringWriter;   // NEW IMPORT
import java.io.PrintWriter;     // NEW IMPORT
import org.springframework.http.HttpHeaders; // NEW IMPORT
import org.springframework.http.ResponseEntity; // NEW IMPORT
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leave-requests")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaveRequestController {

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final AnalyticsService analyticsService;
    private final LeaveRequestService leaveRequestService;
    private final AuditLogService auditLogService;

    public LeaveRequestController(LeaveRequestRepository leaveRequestRepository, UserRepository userRepository, AnalyticsService analyticsService, LeaveRequestService leaveRequestService, AuditLogService auditLogService) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.userRepository = userRepository;
        this.analyticsService = analyticsService;
        this.leaveRequestService = leaveRequestService;
        this.auditLogService = auditLogService;
    }

    // 1. Apply for Leave
    @PostMapping
    public LeaveRequest applyForLeave(@RequestBody LeaveRequest request) {
        return leaveRequestService.applyForLeave(request);
    }

    // 2. Trigger to Fix Old Records
    @GetMapping("/fix-old-data")
    public String fixOldData() {
        leaveRequestService.fixOldRecords();
        return "Success! All old leave requests have been updated with calculated days.";
    }

    // 3. Get Pending Requests
    @GetMapping("/pending")
    public List<LeaveRequest> getPendingRequests() {
        return leaveRequestRepository.findByStatus("PENDING");
    }

    // 4. Approve Leave
    @PutMapping("/{id}/approve")
    public LeaveRequest approveLeave(@PathVariable Long id) {
        return leaveRequestService.approveLeave(id);
    }

    // 5. Reject Leave
    @PutMapping("/{id}/reject")
    public LeaveRequest rejectLeave(@PathVariable Long id) {
        return leaveRequestService.rejectLeave(id);
    }

    // 6. Get User History
    @GetMapping("/user/{userId}")
    public List<LeaveRequest> getUserHistory(@PathVariable Long userId) {
        return leaveRequestRepository.findByUserId(userId);
    }

    // 7. AI Prediction
    @GetMapping("/analytics/prediction")
    public Map<String, Object> getPrediction() {
        return analyticsService.getPrediction();
    }

    // 8. Get Leave Balance
    @GetMapping("/balance/{userId}")
    public Map<String, Object> getLeaveBalance(@PathVariable Long userId) {
        List<LeaveRequest> userRequests = leaveRequestRepository.findByUserId(userId)
                .stream()
                .filter(req -> "APPROVED".equals(req.getStatus()))
                .toList();

        long daysUsed = 0;
        for (LeaveRequest req : userRequests) {
            if (req.getNumberOfDays() != null) {
                daysUsed += req.getNumberOfDays();
            } else if (req.getStartDate() != null && req.getEndDate() != null) {
                daysUsed += ChronoUnit.DAYS.between(req.getStartDate(), req.getEndDate()) + 1;
            }
        }

        long allocatedDays = 20;
        long remainingDays = allocatedDays - daysUsed;

        Map<String, Object> balance = new HashMap<>();
        balance.put("allocated", allocatedDays);
        balance.put("used", daysUsed);
        balance.put("remaining", remainingDays);
        balance.put("status", remainingDays < 0 ? "OVER_LIMIT" : remainingDays < 5 ? "LOW" : "OK");

        return balance;
    }

    // 9. Get Historical Trends
    @GetMapping("/analytics/history")
    public List<Map<String, Object>> getHistory() {
        return analyticsService.getHistoricalTrends();
    }

    // 10. Get Audit Logs
    @GetMapping("/audit-logs")
    public List<AuditLog> getAuditLogs() {
        return auditLogService.getAllLogs();
    }

    // 11. NEW: Export Leave Report to CSV
    @GetMapping("/export")
    public ResponseEntity<String> exportReport() {
        List<LeaveRequest> requests = leaveRequestRepository.findAll();

        // Create CSV Content
        StringWriter writer = new StringWriter();
        PrintWriter csvWriter = new PrintWriter(writer);

        // Header Row
        csvWriter.println("ID,User ID,Start Date,End Date,Reason,Status,Days");

        // Data Rows
        for (LeaveRequest req : requests) {
            csvWriter.printf("%d,%d,%s,%s,\"%s\",%s,%d%n",
                    req.getId(),
                    req.getUserId(),
                    req.getStartDate(),
                    req.getEndDate(),
                    req.getReason() != null ? req.getReason().replace("\"", "\"\"") : "",
                    req.getStatus(),
                    req.getNumberOfDays() != null ? req.getNumberOfDays() : 0
            );
        }
        csvWriter.flush();

        // Return as downloadable file
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=leave_report.csv")
                .header(HttpHeaders.CONTENT_TYPE, "text/csv")
                .body(writer.toString());
    }
}