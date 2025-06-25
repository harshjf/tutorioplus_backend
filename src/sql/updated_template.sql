UPDATE notification_templates
SET 
subject='%serviceName% Request',
wildcards = '["%studentName%"]'::jsonb,
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>Tutorioplus Admin</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> A New student has successfully completed the registration for %serviceName%. Kindly visit your admin portal and review it. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Student''s Name- <strong>%studentName%</strong></div><div style="margin-top: 20px; font-size: 14px;"> Many Thanks,<br><strong>Team Tutorioplus</strong></div></div>'
WHERE name = 'SERVICE_ADDED_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
subject='Student Grievance Alert! ',
wildcards = '["%studentName%"]'::jsonb,
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>Tutorioplus Admin</strong>,</div><div style="margin-bottom: 20px; font-size: 14px;"> A student grievance has been recorded on the portal. Kindly review it. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Student''s Name- <strong>%studentName%</strong></div><div style="margin-top: 20px; font-size: 14px;"> Regards,<br><strong>Team Tutorioplus</strong></div></div>'
WHERE name = 'GRIEVANCE_ADDED_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
  wildcards = '["%studentName%"]'::jsonb,
  subject = 'New Student Registration Update',
  content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>Tutorioplus Admin</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> A new student has successfully completed the registration on the website. Kindly visit your admin portal and review it. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Student''s Name- <strong>%studentName%</strong></div></div>'
WHERE name = 'ADDED_STUDENT_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
  wildcards = '["%studentName%"]'::jsonb,
  subject = 'New Assignment Submission Update',
  content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>Tutorioplus Admin</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> There is a new assignment submission by a student. Kindly review it at your earliest convenience. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Student''s Name- <strong>%studentName%</strong></div><div style="margin-top: 20px; font-size: 14px;"> Regards,<br><strong>Team Tutorioplus</strong></div></div>'
WHERE name = 'ASSIGNMENT_SUBMITTED_ADMIN_EMAIL_TEMPLATE';



INSERT INTO notifications (name, category) VALUES ('DEMO_CLASS_REQUEST_STUDENT', 'SERVICE');

INSERT INTO notification_templates (name, wildcards, subject, content) VALUES
(
  'DEMO_CLASS_REQUEST_STUDENT_EMAIL_TEMPLATE',
  '["%studentName%", "%time%", "%duration%", "%topic%"]'::jsonb,
  'Demo Class Request Confirmation',
  '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> Your demo class request has been successfully registered. Our team will review and confirm your slot shortly. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Request Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Time- <strong>%time%</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Duration- <strong>%duration%</strong></div><div style="margin-bottom: 20px; font-size: 14px;"> Topic- <strong>%topic%</strong></div><div style="margin-bottom: 15px; font-size: 14px;"> Need Help? Contact us at-<br><a href="mailto:support@tutorioplus.com" style="color: #0091cf; text-decoration: none;">support@tutorioplus.com</a></div><div style="margin-top: 20px; font-size: 14px;"> Best Wishes,<br><strong>Team Tutorioplus</strong><br><a href="https://www.tutorioplus.com/" style="color: #0091cf; text-decoration: none;" target="_blank">https://www.tutorioplus.com/</a></div></div>'
);

INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id)
SELECT 
    n.id,
    c.id,
    t.id
FROM notifications n
JOIN notification_templates t ON t.name = n.name || '_EMAIL_TEMPLATE'
JOIN notification_channels c ON c.name = 'EMAIL'
WHERE n.name IN ('DEMO_CLASS_REQUEST_STUDENT');

UPDATE notification_templates
SET 
subject = 'Demo Class Request Received',
content = '<div style=font-family:Arial,sans-serif;color:#000;line-height:1.5><div style=margin-bottom:15px;font-size:14px>Dear <strong>%studentName%</strong>,</div><div style=margin-bottom:15px;font-size:14px>Welcome to <strong>Tutorioplus!</strong></div><div style=margin-bottom:15px;font-size:14px>Thank you for showing interest in our services. We''re excited to have you with us. Our team has received your request for a demo class, and we''ll be sending you the details shortly.</div><div style=margin-bottom:15px;font-size:14px>We truly appreciate the opportunity to support your learning journey and are committed to providing you with a valuable and enriching experience.</div><div style=margin-bottom:15px;font-size:14px>Thank you for choosing Tutorioplus!</div><div style=margin-bottom:15px;font-size:14px>Warm Regards,<br><strong>Team Tutorioplus</strong><br><a href=https://www.tutorioplus.com/ style=color:#0091cf;text-decoration:none target=_blank>https://www.tutorioplus.com/</a></div></div>'
WHERE name = 'DEMO_CLASS_REQUEST_STUDENT_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
wildcards = '["%studentName%"]'
WHERE name = 'DEMO_CLASS_REQUEST_STUDENT_EMAIL_TEMPLATE';
