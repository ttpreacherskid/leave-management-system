package com.slms.controller;

import com.slms.service.PayrollService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "http://localhost:5173")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @GetMapping("/calculate/{userId}")
    public Map<String, Object> getPayroll(
            @PathVariable Long userId,
            @RequestParam int month,
            @RequestParam int year) {
        return payrollService.calculatePayroll(userId, month, year);
    }
}