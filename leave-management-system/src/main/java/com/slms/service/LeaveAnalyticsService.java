package com.slms.service;

import com.slms.entity.LeaveAnalytics;
import com.slms.repository.LeaveAnalyticsRepository;
import org.springframework.stereotype.Service;

@Service
public class LeaveAnalyticsService {

    private final LeaveAnalyticsRepository analyticsRepository;

    public LeaveAnalyticsService(LeaveAnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    public LeaveAnalytics saveAnalytics(LeaveAnalytics analytics) {
        return analyticsRepository.save(analytics);
    }
}
