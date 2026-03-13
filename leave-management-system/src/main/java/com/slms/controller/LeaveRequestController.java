package com.slms.controller;

import com.slms.entity.LeaveRequest;
import com.slms.service.LeaveRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
@CrossOrigin
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping
    public LeaveRequest applyForLeave(@RequestBody LeaveRequest request) {
        return leaveRequestService.applyForLeave(request);
    }

    @GetMapping("/pending")
    public List<LeaveRequest> getPendingRequests() {
        return leaveRequestService.getPendingRequests();
    }

    @PutMapping("/{id}/approve")
    public LeaveRequest approveLeave(@PathVariable Long id) {
        return leaveRequestService.approveLeave(id);
    }

    @PutMapping("/{id}/reject")
    public LeaveRequest rejectLeave(@PathVariable Long id) {
        return leaveRequestService.rejectLeave(id);
    }
}
