package com.slms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leave_analytics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String month;

    private int totalRequests;

    private int approvedRequests;

    private int rejectedRequests;
}
