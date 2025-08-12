INSERT INTO notifications (name, category)
SELECT 'ASSIGNMENT_ANSWERED', 'ASSIGNMENT'
WHERE NOT EXISTS (
    SELECT 1 FROM notifications WHERE name = 'ASSIGNMENT_ANSWERED'
);

INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id)
SELECT 
    n.id,
    c.id,
    t.id
FROM notifications n
CROSS JOIN notification_channels c
CROSS JOIN notification_templates t
WHERE n.name = 'ASSIGNMENT_ANSWERED'
AND c.name = 'EMAIL'
AND t.name = 'ASSIGNMENT_ANSWERED_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
subject='%serviceName% Confirmation',
wildcards = '["%studentName%", "%serviceName%", "%time%", "%duration%", "%topic%"]'::jsonb,
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 20px; font-size: 14px;"> Your request for %serviceName% has successfully been registered. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Time- <strong>%time%</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Duration- <strong>%duration%</strong></div><div style="margin-bottom: 20px; font-size: 14px;"> Topic- <strong>%topic%</strong></div><div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 20px 0; font-family: Arial, sans-serif; color: #000; line-height: 1.6;"><div style="margin-bottom: 15px; font-size: 16px;"> For any assistance, please feel free to reach out to us at </div><table cellpadding="0" cellspacing="0" border="0" style="font-size: 16px;"><tr><td valign="middle" style="padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/email.png" alt="Email Icon" width="20" style="vertical-align: middle;" /></td><td><a href="mailto:contact@tutorioplus.com" style="color: #00a4e1; text-decoration: none;">contact@tutorioplus.com</a></td></tr><tr><td valign="middle" style="padding-top: 10px; padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/web.png" alt="Web Icon" width="20" style="vertical-align: middle;" /></td><td style="padding-top: 10px;"><a href="https://www.tutorioplus.com" target="_blank" style="color: #00a4e1; text-decoration: none;">Ask I-Buddy</a></td></tr></table></div>
<div style="margin-top: 20px; font-size: 14px;"> Best Wishes,<br><strong>Team Tutorioplus</strong></div></div>'
WHERE name = 'SERVICE_ADDED_STUDENT_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
subject='Demo class request',
wildcards = '["%studentName%","%country%"]'::jsonb,
content = '<div style="font-family: Arial, sans-serif; color: black;"><p style="font-size: 16px; margin-bottom: 20px;">Dear Tutorioplus Admin,</p><p style="font-size: 16px; margin-bottom: 20px;">A new request for demo class has been registered on the portal. kindly review it at your earliest convenience.</p><div style="margin-bottom: 20px;"><p style="font-size: 16px; color: red; font-weight: bold; margin-bottom: 10px;">Details-</p><p style="font-size: 16px; margin: 5px 0;">Student''s Name- %studentName%</p><p style="font-size: 16px; margin: 5px 0;">Country- %country%</p></div><p style="font-size: 16px; margin-bottom: 10px;">Many Thanks,</p><p style="font-size: 16px; font-weight: bold; margin-top: 0;">Team Tutorioplus</p></div>'
WHERE name = 'DEMO_CLASS_REQUEST_ADDED_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
subject = 'Acceptance of Demo Class Request',
wildcards = '["%studentName%","%time%","%duration%","%topic%"]'::jsonb, 
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 20px; font-size: 14px;"> Your request for demo class has successfully been registered on our portal. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Time- <strong>%time%</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Duration- <strong>%duration%</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Price- <strong style="color: #008000;">Free</strong></div><div style="margin-bottom: 20px; font-size: 14px;"> Topic- <strong>%topic%</strong></div><div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 20px 0; font-family: Arial, sans-serif; color: #000; line-height: 1.6;"><div style="margin-bottom: 15px; font-size: 16px;"> For any assistance, please feel free to reach out to us at </div><table cellpadding="0" cellspacing="0" border="0" style="font-size: 16px;"><tr><td valign="middle" style="padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/email.png" alt="Email Icon" width="20" style="vertical-align: middle;" /></td><td><a href="mailto:contact@tutorioplus.com" style="color: #00a4e1; text-decoration: none;">contact@tutorioplus.com</a></td></tr><tr><td valign="middle" style="padding-top: 10px; padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/web.png" alt="Web Icon" width="20" style="vertical-align: middle;" /></td><td style="padding-top: 10px;"><a href="https://www.tutorioplus.com" target="_blank" style="color: #00a4e1; text-decoration: none;">Ask I-Buddy</a></td></tr></table></div><div style="margin-top: 20px; font-size: 14px;"> Best Wishes,<br><strong>Team Tutorioplus</strong></div></div>'
WHERE name = 'DEMO_CLASS_REQUEST_STUDENT_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
subject='Acceptance of the Grievance',
wildcards = '["%studentName%"]'::jsonb,
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.6; font-size: 14px;"><div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> Your Grievance has successfully been registered on our platform. Our team will reach out to you soon and it will soon be resolved. </div><div style="margin-bottom: 20px; font-size: 14px;"><strong>Action-</strong><span style="color: #ff0000;"><strong>Pending</strong></span></div></div><div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 20px 0; font-family: Arial, sans-serif; color: #000; line-height: 1.6;"><div style="margin-bottom: 15px; font-size: 16px;"> For any assistance, please feel free to reach out to us at </div><table cellpadding="0" cellspacing="0" border="0" style="font-size: 16px;"><tr><td valign="middle" style="padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/email.png" alt="Email Icon" width="20" style="vertical-align: middle;" /></td><td><a href="mailto:contact@tutorioplus.com" style="color: #00a4e1; text-decoration: none;">contact@tutorioplus.com</a></td></tr><tr><td valign="middle" style="padding-top: 10px; padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/web.png" alt="Web Icon" width="20" style="vertical-align: middle;" /></td><td style="padding-top: 10px;"><a href="https://www.tutorioplus.com" target="_blank" style="color: #00a4e1; text-decoration: none;">Ask I-Buddy</a></td></tr></table></div><div style="margin-top: 30px; font-size: 14px;"> Thanks and Regards,<br><strong>Team Tutorioplus</strong><br></div>'
WHERE name = 'GRIEVANCE_ADDED_STUDENT_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
subject='Resolution of Your Grievance',
wildcards = '["%studentName%"]'::jsonb,
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.6; font-size: 14px;"><div style="margin-bottom: 10px;"> Dear <strong>%studentName%</strong>, </div><div style="margin-bottom: 10px;"> We are pleased to inform you that your grievance has been successfully resolved. Thank you for your patience and continued support. We truly appreciate your association with us, and we look forward to working with you again in the future. We will also strive to ensure that you do not face any such issues going forward. </div><div style="margin-top: 15px;"><strong>Action-</strong><span style="color: green; font-weight: bold; margin-bottom:20px;"> Resolve</span></div></div><div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 20px 0; font-family: Arial, sans-serif; color: #000; line-height: 1.6;"><div style="margin-bottom: 15px; font-size: 16px;"> For any assistance, please feel free to reach out to us at </div><table cellpadding="0" cellspacing="0" border="0" style="font-size: 16px;"><tr><td valign="middle" style="padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/email.png" alt="Email Icon" width="20" style="vertical-align: middle;" /></td><td><a href="mailto:contact@tutorioplus.com" style="color: #00a4e1; text-decoration: none;">contact@tutorioplus.com</a></td></tr><tr><td valign="middle" style="padding-top: 10px; padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/web.png" alt="Web Icon" width="20" style="vertical-align: middle;" /></td><td style="padding-top: 10px;"><a href="https://www.tutorioplus.com" target="_blank" style="color: #00a4e1; text-decoration: none;">Ask I-Buddy</a></td></tr></table></div><div style="margin-top: 30px; font-size: 14px;"> Thanks and Regards,<br><strong>Team Tutorioplus</strong><br></div>'
WHERE name = 'GRIEVANCE_RESOLVED_EMAIL_TEMPLATE';


INSERT INTO notifications (name, category) VALUES
('COUNSELLING_REQUEST_ADDED_STUDENT', 'SERVICE');

INSERT INTO notification_templates (name, wildcards, subject, content) VALUES
('COUNSELLING_REQUEST_ADDED_STUDENT_EMAIL_TEMPLATE', 
'["%studentName%"]'::jsonb, 
'Thank You for Requesting Counselling – We’ll Reach Out Soon! ',
'<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 20px; font-size: 14px;"> Thank you for filling out the counselling form on our website. We’re excited to help you explore theright path for your future. Our team has received your request and will get in touch with you shortlyto schedule your counselling session. </div><div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 20px 0; font-family: Arial, sans-serif; color: #000; line-height: 1.6;"><div style="margin-bottom: 15px; font-size: 16px;"> For any assistance, please feel free to reach out to us at </div><table cellpadding="0" cellspacing="0" border="0" style="font-size: 16px;"><tr><td valign="middle" style="padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/email.png" alt="Email Icon" width="20" style="vertical-align: middle;" /></td><td><a href="mailto:contact@tutorioplus.com" style="color: #00a4e1; text-decoration: none;">contact@tutorioplus.com</a></td></tr><tr><td valign="middle" style="padding-top: 10px; padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/web.png" alt="Web Icon" width="20" style="vertical-align: middle;" /></td><td style="padding-top: 10px;"><a href="https://www.tutorioplus.com" target="_blank" style="color: #00a4e1; text-decoration: none;">Ask I-Buddy</a></td></tr></table></div><div style="margin-top: 20px; font-size: 14px;"> Best Wishes,<br><strong>Team Tutorioplus</strong></div></div>');

INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id)
SELECT 
    n.id,
    c.id,
    t.id
FROM notifications n
JOIN notification_templates t ON t.name = 'COUNSELLING_REQUEST_ADDED_STUDENT_EMAIL_TEMPLATE'
JOIN notification_channels c ON c.name = 'EMAIL'
WHERE n.name = 'COUNSELLING_REQUEST_ADDED_STUDENT';

INSERT INTO notifications (name, category) VALUES
('COUNSELLING_REQUEST_ADDED', 'SERVICE');

INSERT INTO notification_templates (name, wildcards, subject, content) VALUES
('COUNSELLING_REQUEST_ADDED_EMAIL_TEMPLATE', 
'["%studentName%","%country%"]'::jsonb, 
'New Student Registration for Counselling.',
'<div style="font-family: Arial, sans-serif; color: black;"><p style="font-size: 16px; margin-bottom: 20px;">Dear Tutorioplus Admin,</p><p style="font-size: 16px; margin-bottom: 20px;">We’re pleased to inform you that a new student has successfully completed their registration forthe Counselling. Please log in to your admin portal to review the details.</p><div style="margin-bottom: 20px;"><p style="font-size: 16px; color: red; font-weight: bold; margin-bottom: 10px;">Details-</p><p style="font-size: 16px; margin: 5px 0;">Student''s Name- %studentName%</p><p style="font-size: 16px; margin: 5px 0;">Country- %country%</p></div><p style="font-size: 16px; margin-bottom: 10px;">Many Thanks,</p><p style="font-size: 16px; font-weight: bold; margin-top: 0;">Team Tutorioplus</p></div>');

INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id)
SELECT 
    n.id,
    c.id,
    t.id
FROM notifications n
JOIN notification_templates t ON t.name = 'COUNSELLING_REQUEST_ADDED_EMAIL_TEMPLATE'
JOIN notification_channels c ON c.name = 'EMAIL'
WHERE n.name = 'COUNSELLING_REQUEST_ADDED';

UPDATE notification_templates
SET 
  wildcards='["%BODY%"]'::jsonb,
  subject='Base Template',
  content = '<!DOCTYPE html><html lang="en"><body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f6f8"><tr><td align="center" style="padding: 0; border-bottom: 1px solid #eee;"><table width="650" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #ccc; margin: 20px 0;"><tr><td style="padding: 0; border-bottom: 1px solid #eee;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;"><tr><!-- Logo --><td width="20%" align="center" style="padding: 10px; background-color:#f9f9f9"><img src="https://tutorioplus.com/images/logo_tuto.png" alt="Tutorioplus Logo" width="100" style="display: block;" /></td><!-- Blue Middle Section --><td width="55%" style="background-color: #1f4ec2; padding: 10px 0;"><div style="text-align: center;"><div style="font-size: 48px; font-weight: bold; color: #ff7f50; line-height: 1.2; text-decoration:underline"> TUTORIOPLUS </div><div style="font-size: 27px; font-weight: bold; color: #ff7f50; line-height: 1.2; margin-top: 4px;"> GLOBAL LEARNING PATH </div></div></td><!-- Right-side Illustration --><td width="25%" align="center" style="padding: 0; margin: 0;"><img src="https://tutorioplus.com/images/newEmail.jpg" alt="Student Illustration" style="display: block; width: 100%; height: 100%; object-fit: cover;" /></td></tr></table></td></tr><!-- Body Section --><tr><td style="padding: 20px 30px;"> %BODY% </td></tr><!-- Footer Section --><tr><td style="padding: 20px 30px; text-align: center;"><p style="margin: 0; font-size: 16px; font-weight: bold;">Stay Connected</p><div style="margin: 10px 0;"><a href="https://www.facebook.com/tutorioplus" target="_blank" style="margin: 0 5px; text-decoration: none;"><img src="https://tutorioplus.com/images/icons/facebook.png" alt="Facebook" width="30" /></a><a href="https://www.instagram.com/tutorioplus/?igsh=MWUzMnhpaTNkN3hhNA%3D%3D#" target="_blank" style="margin: 0 5px; text-decoration: none;"><img src="https://tutorioplus.com/images/icons/instagram.png" alt="Instagram" width="30" /></a><a href="https://www.youtube.com/@tutorioplus" target="_blank" style="margin: 0 5px; text-decoration: none;"><img src="https://tutorioplus.com/images/icons/youtube.png" alt="YouTube" width="30" /></a><a href="https://www.linkedin.com/company/tutorioplus/" target="_blank" style="margin: 0 5px; text-decoration: none;"><img src="https://tutorioplus.com/images/icons/linkedin.png" alt="LinkedIn" width="30" /></a></div><p style="font-size: 14px; color:black">&copy;2025 Tutorioplus Private Limited, All Rights Reserved.</p></td></tr></table></td></tr></table></body></html>'
WHERE 
  name = 'BASE_TEMPLATE';

ALTER TABLE session_based_services DROP COLUMN timezone;
ALTER TABLE session_based_services ADD COLUMN country_code VARCHAR(10);