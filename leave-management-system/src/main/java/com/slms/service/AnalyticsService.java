package com.slms.service;

import com.slms.entity.LeaveRequest;
import com.slms.entity.User;
import com.slms.repository.LeaveRequestRepository;
import com.slms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository; // Added UserRepository
    private final RestTemplate restTemplate = new RestTemplate();
    private final String PYTHON_API_URL = "http://127.0.0.1:5000/predict";


    public AnalyticsService(LeaveRequestRepository leaveRequestRepository, UserRepository userRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> getPrediction() {
        List<LeaveRequest> requests = leaveRequestRepository.findAll();


        List<User> allUsers = userRepository.findAll();
        Map<Long, User> userMap = new HashMap<>();
        for (User u : allUsers) {
            userMap.put(u.getId(), u);
        }


        Map<String, Map<Integer, Integer>> deptMonthCounts = new HashMap<>();

        for (LeaveRequest req : requests) {
            if (req.getStartDate() != null) {

                String dept = "Unknown";

                User user = userMap.get(req.getUserId());
                if (user != null && user.getDepartment() != null) {
                    dept = user.getDepartment();
                }

                int month = req.getStartDate().getMonthValue();


                deptMonthCounts.computeIfAbsent(dept, k -> new HashMap<>());
                Map<Integer, Integer> monthMap = deptMonthCounts.get(dept);


                monthMap.put(month, monthMap.getOrDefault(month, 0) + 1);
            }
        }

        List<Map<String, Object>> history = new ArrayList<>();
        for (String dept : deptMonthCounts.keySet()) {
            for (Map.Entry<Integer, Integer> entry : deptMonthCounts.get(dept).entrySet()) {
                Map<String, Object> item = new HashMap<>();
                item.put("department", dept);
                item.put("month", entry.getKey());
                item.put("count", entry.getValue());
                history.add(item);
            }
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("history", history);

        // 5. Call Python
        try {
            System.out.println("Sending department data to Python...");
            @SuppressWarnings("unchecked")
            Map<String, Object> prediction = restTemplate.postForObject(PYTHON_API_URL, payload, Map.class);
            return prediction;
        } catch (Exception e) {
            System.err.println("Error calling Python: " + e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("error", "ML Service Error");
            return error;
        }
    }


    public List<Map<String, Object>> getHistoricalTrends() {
        List<LeaveRequest> requests = leaveRequestRepository.findAll();

        Map<Integer, Integer> monthCounts = new HashMap<>();
        for (int i = 1; i <= 12; i++) monthCounts.put(i, 0);

        for (LeaveRequest req : requests) {
            if (req.getStartDate() != null) {
                int month = req.getStartDate().getMonthValue();
                monthCounts.put(month, monthCounts.get(month) + 1);
            }
        }

        return monthCounts.entrySet().stream()
                .map(e -> Map.of("month", (Object) e.getKey(), "count", (Object) e.getValue()))
                .sorted((a, b) -> (int) a.get("month") - (int) b.get("month"))
                .collect(Collectors.toList());
    }
}