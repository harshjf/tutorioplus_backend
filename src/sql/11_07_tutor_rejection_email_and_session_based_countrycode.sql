-- Add new notification type for tutor rejection
INSERT INTO notifications (name, category) VALUES
('MENTOR_REJECTED', 'MENTOR');

-- Add email template for tutor rejection
INSERT INTO notification_templates (name, wildcards, subject, content) VALUES
('MENTOR_REJECTED_EMAIL_TEMPLATE', 
'["%tutorName%"]'::jsonb, 
'Update on Your Tutor Application',
'<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;">
<div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%tutorName%</strong>,</div>
<div style="margin-bottom: 15px; font-size: 14px;">Thank you for your interest in joining our e-learning platform as a tutor. We truly appreciate the time and effort you took to apply and share your background with us.</div>
<div style="margin-bottom: 15px; font-size: 14px;">After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. While we were impressed with your qualifications, we have received a large number of applications and had to make some difficult decisions based on our current needs and criteria.</div>
<div style="margin-bottom: 15px; font-size: 14px;">Please don''t take this as a reflection of your skills or experience. We encourage you to apply again in the future, as opportunities may arise that better align with your profile.</div>
<div style="margin-bottom: 30px; font-size: 14px;">We sincerely wish you all the best in your teaching journey and thank you once again for your interest in being part of our platform.</div>
<div style="margin-top: 30px; font-size: 14px;">Warm Regards,<br><strong>Team Tutorioplus</strong></div></div>');

-- Map the template to email channel
INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id)
SELECT 
    n.id,
    c.id,
    t.id
FROM notifications n
JOIN notification_templates t ON t.name = 'MENTOR_REJECTED_EMAIL_TEMPLATE'
JOIN notification_channels c ON c.name = 'EMAIL'
WHERE n.name = 'MENTOR_REJECTED'; 

ALTER TABLE session_based_services
ADD COLUMN country_code VARCHAR(10);
