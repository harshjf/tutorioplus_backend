UPDATE notification_templates
SET 
  content = '<!DOCTYPE html><html lang="en"><body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f6f8"><tr><td align="center" style="padding: 0; border-bottom: 1px solid #eee;"><table width="650" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #ccc; margin: 20px 0;"><tr><td style="padding: 0; border-bottom: 1px solid #eee;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;"><tr><!-- Logo --><td width="20%" align="center" style="padding: 10px; background-color:#f9f9f9"><img src="https://tutorioplus.com/images/logo_tuto.png" alt="Tutorioplus Logo" width="100" style="display: block;" /></td><!-- Blue Middle Section --><td width="55%" style="background-color: #1f4ec2; padding: 10px 0;"><div style="text-align: center;"><div style="font-size: 48px; font-weight: bold; color: #ff7f50; line-height: 1.2; text-decoration:underline"> TUTORIOPLUS </div><div style="font-size: 24px; font-weight: bold; color: #ff7f50; line-height: 1.2; margin-top: 4px;"> GLOBAL LEARNING PATH </div></div></td><!-- Right-side Illustration --><td width="25%" align="center" style="padding: 0; margin: 0;"><img src="https://tutorioplus.com/images/newEmail.jpg" alt="Student Illustration" style="display: block; width: 100%; height: 100%; object-fit: cover;" /></td></tr></table></td></tr><!-- Body Section --><tr><td style="padding: 20px 30px;"> %BODY% </td></tr><!-- Footer Section --><tr><td style="padding: 20px 30px; text-align: center;"><p style="margin: 0; font-size: 16px; font-weight: bold;">Stay Connected</p><div style="margin: 10px 0;"><a href="https://www.facebook.com/tutorioplus" target="_blank" style="margin: 0 5px; text-decoration: none;"><img src="https://tutorioplus.com/images/icons/facebook.png" alt="Facebook" width="30" /></a><a href="https://www.instagram.com/tutorioplus/?igsh=MWUzMnhpaTNkN3hhNA%3D%3D#" target="_blank" style="margin: 0 5px; text-decoration: none;"><img src="https://tutorioplus.com/images/icons/instagram.png" alt="Instagram" width="30" /></a><a href="https://www.youtube.com/@tutorioplus" target="_blank" style="margin: 0 5px; text-decoration: none;"><img src="https://tutorioplus.com/images/icons/youtube.png" alt="YouTube" width="30" /></a><a href="https://www.linkedin.com/company/tutorioplus/" target="_blank" style="margin: 0 5px; text-decoration: none;"><img src="https://tutorioplus.com/images/icons/linkedin.png" alt="LinkedIn" width="30" /></a></div><p style="font-size: 14px; color:black">&copy;2025 Tutorioplus Private Limited, All Rights Reserved.</p></td></tr></table></td></tr></table></body></html>'
WHERE 
  name = 'BASE_TEMPLATE';

INSERT INTO notifications (name, category) VALUES
('MENTOR_ADDED', 'MENTOR');
INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id)
SELECT 
    n.id,
    c.id,
    t.id
FROM notifications n
JOIN notification_templates t ON t.name = 'MENTOR_ADDED_EMAIL_TEMPLATE'
JOIN notification_channels c ON c.name = 'EMAIL'
WHERE n.name = 'MENTOR_ADDED'; 

UPDATE notification_templates
SET 
subject='Successful Registration on Tutorioplus',
content = '<tr><td style="padding: 20px 30px;"><div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 15px;">Welcome to <strong>Tutorioplus</strong></div><div style="margin-bottom: 15px;">We are pleased to inform you that your registration on our website has been successfully completed. You are now part of our student community. On our platform you can avail the benefits of various things like Assignment help/Project help/ Online classes and much more.</div><div style="margin-bottom: 15px;">Here are your next steps-</div><ol style="margin-top: 0; padding-left: 20px;"><li style="margin-bottom: 5px;">Login using your registered email id and password.</li><li style="margin-bottom: 5px;">Explore your student dashboard for course details, announcements and updates</li><li style="margin-bottom: 5px;">Reach out to the admin in case of any queries.</li></ol><div style="margin-bottom: 15px;">If you did not register or believe this Email was sent to you in error, please contact us immediately or avoid this mail.</div><div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 20px 0; font-family: Arial, sans-serif; color: #000; line-height: 1.6;"><div style="margin-bottom: 15px; font-size: 16px;"> For any assistance, please feel free to reach out to us at </div><table cellpadding="0" cellspacing="0" border="0" style="font-size: 16px;"><tr><td valign="middle" style="padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/email.png" alt="Email Icon" width="20" style="vertical-align: middle;" /></td><td><a href="mailto:contact@tutorioplus.com" style="color: #00a4e1; text-decoration: none;">contact@tutorioplus.com</a></td></tr><tr><td valign="middle" style="padding-top: 10px; padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/web.png" alt="Web Icon" width="20" style="vertical-align: middle;" /></td><td style="padding-top: 10px;"><a href="https://www.tutorioplus.com" target="_blank" style="color: #00a4e1; text-decoration: none;">Ask I-Buddy</a></td></tr></table></div><div style="margin-top: 20px;"> Thanks and Regards,<br><strong>Team Tutorioplus</strong><br></div></div></td></tr>'
WHERE name = 'ONBOARDING_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
  wildcards = '["%studentName%", "%country%"]'::jsonb,
  subject = 'New Student Registration Update',
  content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>Tutorioplus Admin</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> A new student has successfully completed the registration on the website. Kindly visit your admin portal and review it. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Student''s Name- <strong>%studentName%</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Country- <strong>%country%</strong></div></div>'
WHERE name = 'ADDED_STUDENT_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
  wildcards = '["%studentName%", "%country%"]'::jsonb,
  subject = 'New Assignment Submission Update',
  content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>Tutorioplus Admin</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> There is a new assignment submission by a student. Kindly review it at your earliest convenience. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Student''s Name- <strong>%studentName%</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Country- <strong>%country%</strong></div><div style="margin-top: 20px; font-size: 14px;"> Regards,<br><strong>Team Tutorioplus</strong></div></div>'
WHERE name = 'ASSIGNMENT_SUBMITTED_ADMIN_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
  wildcards = '["%studentName%"]'::jsonb,
  subject = 'Assignment Submission Confirmation',
  content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> This is to confirm that we have successfully received your assignment submission. Our team will review your assignment and provide feedback soon. If there are any issues or additional instructions, we will contact you. </div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> Thank you for giving us the opportunity to serve you. </div><div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 20px 0; font-family: Arial, sans-serif; color: #000; line-height: 1.6;"><div style="margin-bottom: 15px; font-size: 16px;"> For any assistance, please feel free to reach out to us at </div><table cellpadding="0" cellspacing="0" border="0" style="font-size: 16px;"><tr><td valign="middle" style="padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/email.png" alt="Email Icon" width="20" style="vertical-align: middle;" /></td><td><a href="mailto:contact@tutorioplus.com" style="color: #00a4e1; text-decoration: none;">contact@tutorioplus.com</a></td></tr><tr><td valign="middle" style="padding-top: 10px; padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/web.png" alt="Web Icon" width="20" style="vertical-align: middle;" /></td><td style="padding-top: 10px;"><a href="https://www.tutorioplus.com" target="_blank" style="color: #00a4e1; text-decoration: none;">Ask I-Buddy</a></td></tr></table></div><div style="margin-top: 20px; font-size: 14px;"> Best Wishes,<br><strong>Team Tutorioplus</strong></div>
			</div>'
WHERE name = 'ASSIGNMENT_SUBMITTED_STUDENT_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
  subject = 'Assignment Completion Update',
  content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> we are pleased to inform you that your submitted assignment has been successfully completed. Kindly login and review if you want any changes, do contact us. </div><div style="margin-bottom: 20px; font-size: 14px;"><span style="color: #ff0000;"><strong>Status-</strong></span><span style="color: #008000;"><strong>Completed</strong></span></div><div style="margin-bottom: 20px; font-size: 14px;"> Thank you for choosing us. </div><div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 20px 0; font-family: Arial, sans-serif; color: #000; line-height: 1.6;"><div style="margin-bottom: 15px; font-size: 16px;"> For any assistance, please feel free to reach out to us at </div><table cellpadding="0" cellspacing="0" border="0" style="font-size: 16px;"><tr><td valign="middle" style="padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/email.png" alt="Email Icon" width="20" style="vertical-align: middle;" /></td><td><a href="mailto:contact@tutorioplus.com" style="color: #00a4e1; text-decoration: none;">contact@tutorioplus.com</a></td></tr><tr><td valign="middle" style="padding-top: 10px; padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/web.png" alt="Web Icon" width="20" style="vertical-align: middle;" /></td><td style="padding-top: 10px;"><a href="https://www.tutorioplus.com" target="_blank" style="color: #00a4e1; text-decoration: none;">Ask I-Buddy</a></td></tr></table></div>
<div style="margin-top: 20px; font-size: 14px;"> Regards,<br><strong>Team Tutorioplus</strong><br></div></div>'
WHERE name = 'ASSIGNMENT_ANSWERED_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
subject='%serviceName% Request',
wildcards = '["%serviceName%","%studentName%", "%country%"]'::jsonb,
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>Tutorioplus Admin</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> A New student has successfully completed the registration for %serviceName%. Kindly visit your admin portal and review it. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Student''s Name- <strong>%studentName%</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Country- <strong>%country%</strong></div><div style="margin-top: 20px; font-size: 14px;"> Many Thanks,<br><strong>Team Tutorioplus</strong></div></div>'
WHERE name = 'SERVICE_ADDED_EMAIL_TEMPLATE';

INSERT INTO notifications (name, category) VALUES
('SERVICE_ADDED', 'USER');
INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id)
SELECT 
    n.id,
    c.id,
    t.id
FROM notifications n
JOIN notification_templates t ON t.name = 'SERVICE_ADDED_EMAIL_TEMPLATE'
JOIN notification_channels c ON c.name = 'EMAIL'
WHERE n.name = 'SERVICE_ADDED'; 

UPDATE notification_templates
SET 
subject='%serviceName% Confirmation',
wildcards = '["%studentName%", "%serviceName%", "%time%", "%duration%", "%topic%"]'::jsonb,
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 20px; font-size: 14px;"> Your request for %serviceName% has successfully been registered. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Time- <strong>%time%</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Duration- <strong>%duration%</strong></div><div style="margin-bottom: 20px; font-size: 14px;"> Topic- <strong>%topic%</strong></div><div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 20px 0; font-family: Arial, sans-serif; color: #000; line-height: 1.6;"><div style="margin-bottom: 15px; font-size: 16px;"> For any assistance, please feel free to reach out to us at </div><table cellpadding="0" cellspacing="0" border="0" style="font-size: 16px;"><tr><td valign="middle" style="padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/email.png" alt="Email Icon" width="20" style="vertical-align: middle;" /></td><td><a href="mailto:contact@tutorioplus.com" style="color: #00a4e1; text-decoration: none;">contact@tutorioplus.com</a></td></tr><tr><td valign="middle" style="padding-top: 10px; padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/web.png" alt="Web Icon" width="20" style="vertical-align: middle;" /></td><td style="padding-top: 10px;"><a href="https://www.tutorioplus.com" target="_blank" style="color: #00a4e1; text-decoration: none;">Ask I-Buddy</a></td></tr></table></div>
<div style="margin-top: 20px; font-size: 14px;"> Best Wishes,<br><strong>Team Tutorioplus</strong><br><a href="https://www.tutorioplus.com/" style="color: #0091cf; text-decoration: none;" target="_blank">https://www.tutorioplus.com/</a></div></div>'
WHERE name = 'SERVICE_ADDED_STUDENT_EMAIL_TEMPLATE';

INSERT INTO notifications (name, category) VALUES
('DEMO_CLASS_REQUEST_ACCEPTED', 'SERVICE');

INSERT INTO notification_templates (name, wildcards, subject, content) VALUES
('DEMO_CLASS_REQUESTED_EMAIL_TEMPLATE', 
'["%studentName%,%time%,%duration%,%subject%"]'::jsonb, 
'Acceptance of Demo Class Request',
'<tr><td style="padding: 20px 30px;"><div style="font-family: Arial, sans-serif; color: #000; line-height: 1.6; font-size: 14px;"><div style="margin-bottom: 10px;"> Dear <strong>%studentName%</strong>, </div><div style="margin-bottom: 20px;"> Your request for demo class has successfully been registered on our portal. </div><div style="margin-bottom: 8px; color: red; font-weight: bold;"> Details- </div><div style="margin-bottom: 5px;"> Time- <strong>%time%</strong></div><div style="margin-bottom: 5px;"> Duration- <strong>%duration%</strong></div><div style="margin-bottom: 5px;"> Price- <strong style="color: green;">Free</strong></div><div style="margin-bottom: 5px;"> Topic- <strong>%subject%</strong></div></div><div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 20px 0; font-family: Arial, sans-serif; color: #000; line-height: 1.6;"><div style="margin-bottom: 15px; font-size: 16px;"> For any assistance, please feel free to reach out to us at </div><table cellpadding="0" cellspacing="0" border="0" style="font-size: 16px;"><tr><td valign="middle" style="padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/email.png" alt="Email Icon" width="20" style="vertical-align: middle;" /></td><td><a href="mailto:contact@tutorioplus.com" style="color: #00a4e1; text-decoration: none;">contact@tutorioplus.com</a></td></tr><tr><td valign="middle" style="padding-top: 10px; padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/web.png" alt="Web Icon" width="20" style="vertical-align: middle;" /></td><td style="padding-top: 10px;"><a href="https://www.tutorioplus.com" target="_blank" style="color: #00a4e1; text-decoration: none;">Ask I-Buddy</a></td></tr></table></div><div style="margin-top: 20px; font-size: 14px;"> Best Wishes,<br><strong>Team Tutorioplus</strong><br><a href="https://www.tutorioplus.com/" style="color: #0091cf; text-decoration: none;" target="_blank">https://www.tutorioplus.com/</a></div></div></td></tr>');

INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id)
SELECT 
    n.id,
    c.id,
    t.id
FROM notifications n
JOIN notification_templates t ON t.name = 'DEMO_CLASS_REQUESTED_EMAIL_TEMPLATE'
JOIN notification_channels c ON c.name = 'EMAIL'
WHERE n.name = 'DEMO_CLASS_REQUEST_ACCEPTED'; 

UPDATE notification_templates
SET 
subject='Acceptance of the Grievance',
wildcards = '["%studentName%"]'::jsonb,
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.6; font-size: 14px;"><div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> Your Grievance has successfully been registered on our platform. Our team will reach out to you soon and it will soon be resolved. </div><div style="margin-bottom: 20px; font-size: 14px;"><strong>Action-</strong><span style="color: #ff0000;"><strong>Pending</strong></span></div></div><div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 20px 0; font-family: Arial, sans-serif; color: #000; line-height: 1.6;"><div style="margin-bottom: 15px; font-size: 16px;"> For any assistance, please feel free to reach out to us at </div><table cellpadding="0" cellspacing="0" border="0" style="font-size: 16px;"><tr><td valign="middle" style="padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/email.png" alt="Email Icon" width="20" style="vertical-align: middle;" /></td><td><a href="mailto:contact@tutorioplus.com" style="color: #00a4e1; text-decoration: none;">contact@tutorioplus.com</a></td></tr><tr><td valign="middle" style="padding-top: 10px; padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/web.png" alt="Web Icon" width="20" style="vertical-align: middle;" /></td><td style="padding-top: 10px;"><a href="https://www.tutorioplus.com" target="_blank" style="color: #00a4e1; text-decoration: none;">Ask I-Buddy</a></td></tr></table></div><div style="margin-top: 30px; font-size: 14px;"> Thanks and Regards,<br><strong>Team Tutorioplus</strong><br><a href="https://www.tutorioplus.com/" style="color: #0091cf; text-decoration: none;" target="_blank">https://www.tutorioplus.com/</a></div>'
WHERE name = 'GRIEVANCE_ADDED_STUDENT_EMAIL_TEMPLATE';

INSERT INTO notifications (name, category) VALUES
('GRIEVANCE_ADDED', 'GRIEVANCE');
INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id)
SELECT 
    n.id,
    c.id,
    t.id
FROM notifications n
JOIN notification_templates t ON t.name = 'GRIEVANCE_ADDED_EMAIL_TEMPLATE'
JOIN notification_channels c ON c.name = 'EMAIL'
WHERE n.name = 'GRIEVANCE_ADDED'; 

UPDATE notification_templates
SET 
subject='Student Grievance Alert! ',
wildcards = '["%studentName%", "%studentEmail%","%country%"]'::jsonb,
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>Tutorioplus Admin</strong>,</div><div style="margin-bottom: 20px; font-size: 14px;"> A student grievance has been recorded on the portal. Kindly review it. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Student''s Name- <strong>%studentName%</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Country- <strong>%country%</strong></div><div style="margin-top: 20px; font-size: 14px;"> Regards,<br><strong>Team Tutorioplus</strong></div></div>'
WHERE name = 'GRIEVANCE_ADDED_EMAIL_TEMPLATE';


INSERT INTO notifications (name, category) VALUES
('GRIEVANCE_RESOLVED', 'GRIEVANCE');
INSERT INTO notification_templates (name, wildcards, subject, content) VALUES
('GRIEVANCE_RESOLVED_EMAIL_TEMPLATE', 
'["%studentName%"]'::jsonb, 
'Resolution of Your Grievance',
'<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.6; font-size: 14px;"><div style="margin-bottom: 10px;"> Dear <strong>%studentName%</strong>, </div><div style="margin-bottom: 10px;"> We are pleased to inform you that your grievance has been successfully resolved. Thank you for your patience and continued support. We truly appreciate your association with us, and we look forward to working with you again in the future. We will also strive to ensure that you do not face any such issues going forward. </div><div style="margin-top: 15px;"><strong>Action-</strong><span style="color: green; font-weight: bold; margin-bottom:20px;">Resolve</span></div></div><div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 20px 0; font-family: Arial, sans-serif; color: #000; line-height: 1.6;"><div style="margin-bottom: 15px; font-size: 16px;"> For any assistance, please feel free to reach out to us at </div><table cellpadding="0" cellspacing="0" border="0" style="font-size: 16px;"><tr><td valign="middle" style="padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/email.png" alt="Email Icon" width="20" style="vertical-align: middle;" /></td><td><a href="mailto:contact@tutorioplus.com" style="color: #00a4e1; text-decoration: none;">contact@tutorioplus.com</a></td></tr><tr><td valign="middle" style="padding-top: 10px; padding-right: 10px;"><img src="https://tutorioplus.com/images/icons/web.png" alt="Web Icon" width="20" style="vertical-align: middle;" /></td><td style="padding-top: 10px;"><a href="https://www.tutorioplus.com" target="_blank" style="color: #00a4e1; text-decoration: none;">Ask I-Buddy</a></td></tr></table></div><div style="margin-top: 30px; font-size: 14px;"> Thanks and Regards,<br><strong>Team Tutorioplus</strong><br><a href="https://www.tutorioplus.com/" style="color: #0091cf; text-decoration: none;" target="_blank">https://www.tutorioplus.com/</a></div>');
INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id)
SELECT 
    n.id,
    c.id,
    t.id
FROM notifications n
JOIN notification_templates t ON t.name = 'GRIEVANCE_RESOLVED_EMAIL_TEMPLATE'
JOIN notification_channels c ON c.name = 'EMAIL'
WHERE n.name = 'GRIEVANCE_RESOLVED'; 

INSERT INTO notifications (name, category) VALUES
('CONTACT_FORM_SUBMISSION', 'GENERAL');

INSERT INTO notification_templates (name, wildcards, subject, content) VALUES
(
  'CONTACT_FORM_EMAIL_TEMPLATE',
  '["%name%", "%email%", "%phone%", "%subject%", "%message%"]'::jsonb,
  'New Contact Form Submission',
  '<div>
    <p><strong>Name:</strong> %name%</p>
    <p><strong>Email:</strong> %email%</p>
    <p><strong>Phone:</strong> %phone%</p>
    <p><strong>Subject:</strong> %subject%</p>
    <p><strong>Message:</strong><br/> %message%</p>
  </div>'
);

INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id)
SELECT 
  n.id, c.id, t.id
FROM notifications n
JOIN notification_templates t ON t.name = 'CONTACT_FORM_EMAIL_TEMPLATE'
JOIN notification_channels c ON c.name = 'EMAIL'
WHERE n.name = 'CONTACT_FORM_SUBMISSION';

ALTER TABLE session_based_services
DROP COLUMN country_code;

ALTER TABLE session_based_services
ADD COLUMN timezone VARCHAR(50);

UPDATE notification_templates
SET 
subject='%serviceName% Request',
wildcards = '["%serviceName%", "%studentName%", "%country%"]'::jsonb,
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>Tutorioplus Admin</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> A New student has successfully completed the registration for %serviceName%. Kindly visit your admin portal and review it. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Student''s Name- <strong>%studentName%</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Country- <strong>%country%</strong></div><div style="margin-top: 20px; font-size: 14px;"> Many Thanks,<br><strong>Team Tutorioplus</strong></div></div>'
WHERE name = 'SERVICE_ADDED_EMAIL_TEMPLATE';
