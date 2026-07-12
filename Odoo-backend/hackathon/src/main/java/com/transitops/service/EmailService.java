package com.transitops.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("alerts@transitops.com");
            
            // Format text as HTML using a nice template
            String htmlContent = "<div style=\"font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px; border-radius: 12px;\">" +
                "<div style=\"background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\">" +
                "<h1 style=\"color: #0f172a; margin-top: 0; font-size: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px;\">" + subject + "</h1>" +
                "<div style=\"color: #334155; font-size: 16px; line-height: 1.6;\">" +
                text.replace("\n", "<br>") +
                "</div>" +
                "<div style=\"margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 14px; text-align: center;\">" +
                "&copy; " + java.time.Year.now().getValue() + " TransitOps Enterprise Logistics. All rights reserved." +
                "</div>" +
                "</div>" +
                "</div>";
                
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("HTML Email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send HTML email to {}", to, e);
        }
    }
}
