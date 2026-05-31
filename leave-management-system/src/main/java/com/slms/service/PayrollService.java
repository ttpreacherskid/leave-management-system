package com.slms.service;

import com.slms.entity.LeaveRequest;
import com.slms.entity.User;
import com.slms.repository.LeaveRequestRepository;
import com.slms.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PayrollService {

    private final UserRepository userRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public PayrollService(UserRepository userRepository, LeaveRequestRepository leaveRequestRepository) {
        this.userRepository = userRepository;
        this.leaveRequestRepository = leaveRequestRepository;
    }

    public Map<String, Object> calculatePayroll(Long userId, int month, int year) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Get Base Salary
        Double baseSalary = user.getSalary() != null ? user.getSalary() : 0.0;

        // 2. Calculate Working Days in Month (Excluding weekends for simplicity)
        YearMonth yearMonth = YearMonth.of(year, month);
        int workingDays = yearMonth.lengthOfMonth(); // Simple logic: use total days.
        // For advanced: logic to exclude weekends.

        // 3. Calculate Leave Taken in that specific month
        List<LeaveRequest> requests = leaveRequestRepository.findByUserId(userId);
        int daysTakenInMonth = 0;

        for (LeaveRequest req : requests) {
            if (req.getStatus().equals("APPROVED")) {
                LocalDate start = req.getStartDate();
                LocalDate end = req.getEndDate();

                // Check if request falls in the target month
                if (start.getMonthValue() == month && start.getYear() == year) {
                    daysTakenInMonth += java.time.temporal.ChronoUnit.DAYS.between(start, end) + 1;
                }
            }
        }

        // 4. Calculate Deductions
        // Assuming standard allowed leave is 1.5 days per month (18 days / 12 months)
        // If they took more than 1.5 days, the rest is Unpaid.
        double allowedMonthlyLeave = 1.5;
        int unpaidDays = (int) Math.max(0, daysTakenInMonth - allowedMonthlyLeave);

        double perDayCost = baseSalary / 22; // Standard 22 working days
        double deduction = unpaidDays * perDayCost;
        double netSalary = baseSalary - deduction;

        // 5. Return Results
        Map<String, Object> payroll = new HashMap<>();
        payroll.put("employeeName", user.getFirstName() + " " + user.getLastName());
        payroll.put("month", month);
        payroll.put("year", year);
        payroll.put("baseSalary", baseSalary);
        payroll.put("daysTaken", daysTakenInMonth);
        payroll.put("unpaidDays", unpaidDays);
        payroll.put("deduction", deduction);
        payroll.put("netSalary", netSalary);

        return payroll;
    }
}