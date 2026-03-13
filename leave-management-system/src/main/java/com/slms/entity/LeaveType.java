package com.slms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leave_types") // Matches SQL table name
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Map Java variable 'name' to SQL column 'type_name'
    @Column(name = "type_name")
    private String name;

    // Map Java variable 'defaultDays' to SQL column 'default_days'
    @Column(name = "default_days")
    private int defaultDays;
}