package com.slms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    // This method sends a real email
    public void sendLeaveStatusNotification(String toEmail, String status, Long requestId) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            // REMOVED: message.setFrom(...)
            // Why? Spring Boot automatically uses the 'spring.mail.username' from your
            // application.properties file as the sender.

            message.setTo(toEmail);
            message.setSubject("Leave Request Status Update");

            String text = "Dear Employee,\n\n" +
                    "Your leave request (ID: " + requestId + ") has been " + status + ".\n\n" +
                    "Regards,\nLeave Management Team";

            message.setText(text);

            mailSender.send(message);

            System.out.println("SUCCESS: Email sent to " + toEmail);

        } catch (Exception e) {
            System.out.println("ERROR: Failed to send email. Check your App Password and Internet connection.");
            e.printStackTrace();
        }
    }
}