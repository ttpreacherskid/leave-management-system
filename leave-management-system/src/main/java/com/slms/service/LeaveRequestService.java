package com.slms.service;

import com.slms.entity.LeaveRequest;
import com.slms.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
    }

    public LeaveRequest applyForLeave(LeaveRequest request) {
        request.setStatus("PENDING");
        return leaveRequestRepository.save(request);
    }

    public List<LeaveRequest> getPendingRequests() {
        return leaveRequestRepository.findByStatus("PENDING");
    }

    public LeaveRequest approveLeave(Long id) {
        LeaveRequest request = leaveRequestRepository.findById(id).orElseThrow();
        request.setStatus("APPROVED");
        return leaveRequestRepository.save(request);
    }

    public LeaveRequest rejectLeave(Long id) {
        LeaveRequest request = leaveRequestRepository.findById(id).orElseThrow();
        request.setStatus("REJECTED");
        return leaveRequestRepository.save(request);
    }
}
