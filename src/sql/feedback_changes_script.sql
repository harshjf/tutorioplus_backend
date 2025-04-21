ALTER TABLE mentor_metadata
ADD COLUMN status VARCHAR(50) DEFAULT 'Pending';

ALTER TABLE mentor_metadata
DROP COLUMN approve

INSERT INTO notifications (name, category) VALUES
('ADDED_STUDENT', 'USER'),
('ASSIGNMENT_SUBMITTED_ADMIN', 'ASSIGNMENT'),
('ASSIGNMENT_SUBMITTED_STUDENT', 'ASSIGNMENT'),
('SERVICE_ADDED_STUDENT', 'SERVICE'),
('GRIEVANCE_ADDED_STUDENT', 'GRIEVANCE'),
('MENTOR_ADDED_MENTOR', 'MENTOR'),
('MENTOR_APPROVED', 'MENTOR');


UPDATE notification_templates
SET 
  content = '<!DOCTYPE html><html lang="en"><body style=" margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, sans-serif; " ><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f6f8" ><tr><td align="center"><table width="650" cellpadding="0" cellspacing="0" border="1" style=" background-color: #fff; border: 1px solid #ccc; margin: 20px 0; " ><!-- Header section --><tr><td style="background-color: #4169E1; padding: 15px 20px"><table width="100%" cellpadding="0" cellspacing="0"><tr><td width="60%" style="vertical-align: middle;"><table><tr><td><img src="https://tutorioplus.com/images/email.jpg" alt="Illustration" width="auto" height="80px" style="max-width: 100%; border-radius: 6px" /></td><td><h1 style=" margin: 0; font-size: 24px; line-height: 1.2; color: #FF7F50; font-weight: bold; "> Empowering Education<br>Through Tech </h1></td></tr></table></td><td width="40%" align="right" style="text-align: right; vertical-align: middle;"><div style="color: #fff; font-size: 14px; text-align: right;"><img src="https://tutorioplus.com/images/logo_tuto.png" alt="Tutorioplus Logo" width="55" height="55" style="display: inline-block; vertical-align: middle;" /><div style=" display: inline-block; vertical-align: middle; margin-left: 5px; "><div style=" color: #FF7F50; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; line-height: 1; text-align: left; "> TUTORIOPLUS <div style=" font-size: 10px; color: #FF7F50; border-top: 1px solid #FF7F50; padding-top: 2px; margin-top: 2px; text-align: left; "> GLOBAL LEARNING PATH </div></div></div></div></td></tr></table></td></tr><!-- Body section --><tr><td style="padding: 20px 30px">%BODY%</td></tr><!-- Social media section --><tr><td style="text-align: center; padding: 15px 20px; border-top: 1px solid #eee;"><div>Follow Us On</div><div style="margin-top: 10px;"><a href="#" style="display: inline-block; margin: 0 5px;" target="_blank" rel="noopener noreferrer"><img src="https://tutorioplus.com/images/icons/facebook.png" alt="Facebook" width="25" height="25" style="border-radius: 50%;"></a><a href="https://www.instagram.com/tutorioplus/" style="display: inline-block; margin: 0 5px;" target="_blank" rel="noopener noreferrer"><img src="https://tutorioplus.com/images/icons/instagram.png" alt="Instagram" width="25" height="25" style="border-radius: 50%;"></a><a href="https://www.youtube.com/@Tutorioplus" style="display: inline-block; margin: 0 5px;" target="_blank" rel="noopener noreferrer"><img src="https://tutorioplus.com/images/icons/video.png" alt="YouTube" width="25" height="25" style="border-radius: 50%;"></a><br/><p style="text-align: center; padding: 10px; font-size: 14px;">&copy;2025 Tutorioplus Pvt. Ltd. All rights reserved.</p></div></td></tr></table></td></tr></table></body></html>'
WHERE 
  name = 'BASE_TEMPLATE';

UPDATE notification_templates
SET 
subject='Successful Registration on Tutorioplus',
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 15px;">Welcome to <strong>Tutorioplus</strong></div><div style="margin-bottom: 15px;">We are pleased to inform you that your registration on our website has been successfully completed. You are now part of our student community. On our platform you can avail the benefits of various things like Assignment help/Project help/ Online classes and much more.</div><div style="margin-bottom: 15px;">Here are your next steps-</div><ol style="margin-top: 0; padding-left: 20px;"><li style="margin-bottom: 5px;">Login using your registered email id and password.</li><li style="margin-bottom: 5px;">Explore your student dashboard for course details, announcements and updates</li><li style="margin-bottom: 5px;">Reach out to the admin in case of any queries.</li></ol><div style="margin-bottom: 15px;">If you did not register or believe this Email was sent to you in error, please contact us immediately or avoid this mail.</div><div style="margin-bottom: 15px;"> Need help? Reach out to us-<br><a href="mailto:support@tutorioplus.com" style="color: #0091cf; text-decoration: none;">support@tutorioplus.com</a></div><div style="margin-top: 20px;"> Thanks and Regards,<br><strong>Team Tutorioplus</strong><br><a href="https://www.tutorioplus.com/" style="color: #0091cf; text-decoration: none;" target="_blank">https://www.tutorioplus.com/</a></div></div>'
WHERE name = 'ONBOARDING_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
  subject = 'Assignment Completion Update',
  content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> we are pleased to inform you that your submitted assignment has been successfully completed. Kindly login and review if you want any changes, do contact us. </div><div style="margin-bottom: 20px; font-size: 14px;"><span style="color: #ff0000;"><strong>Status-</strong></span><span style="color: #008000;"><strong>Completed</strong></span></div><div style="margin-bottom: 20px; font-size: 14px;"> Thank you for choosing us. </div><div style="margin-bottom: 15px; font-size: 14px;"> Got a Question? We''re Here to Answer-<br><a href="mailto:support@tutorioplus.com" style="color: #0091cf; text-decoration: none;">support@tutorioplus.com</a></div><div style="margin-top: 20px; font-size: 14px;"> Regards,<br><strong>Team Tutorioplus</strong><br><a href="https://www.tutorioplus.com/" style="color: #0091cf; text-decoration: none;" target="_blank">https://www.tutorioplus.com/</a></div></div>'
WHERE name = 'ASSIGNMENT_ANSWERED_EMAIL_TEMPLATE';


UPDATE notification_templates
SET 
subject='%serviceName% Request',
wildcards = '["%studentName%", "%studentEmail%", "%serviceName%"]'::jsonb,
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>Tutorioplus Admin</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> A New student has successfully completed the registration for %serviceName%. Kindly visit your admin portal and review it. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Student's Name- <strong>%studentName%</strong></div><div style="margin-bottom: 20px; font-size: 14px;"> Student's Email- <a href="mailto:%studentEmail%" style="color: #0091cf; text-decoration: none;">%studentEmail%</a></div><div style="margin-top: 20px; font-size: 14px;"> Many Thanks,<br><strong>Team Tutorioplus</strong></div></div>'
WHERE name = 'SERVICE_ADDED_EMAIL_TEMPLATE';


UPDATE notification_templates
SET 
subject='Student Grievance Alert! ',
wildcards = '["%studentName%", "%studentEmail%"]'::jsonb,
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>Tutorioplus Admin</strong>,</div><div style="margin-bottom: 20px; font-size: 14px;"> A student grievance has been recorded on the portal. Kindly review it. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Student's Name- <strong>%studentName%</strong></div><div style="margin-bottom: 20px; font-size: 14px;"> Student's Email- <a href="mailto:%studentEmail%" style="color: #0091cf; text-decoration: none;">%studentEmail%</a></div><div style="margin-top: 20px; font-size: 14px;"> Regards,<br><strong>Team Tutorioplus</strong></div></div>'
WHERE name = 'GRIEVANCE_ADDED_EMAIL_TEMPLATE';

UPDATE notification_templates
SET 
subject='Subject Matter Expert Registration Alert! ',
wildcards = '["%mentorName%", "%mentorEmail%"]'::jsonb,
content = '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>Tutorioplus Admin</strong>,</div><div style="margin-bottom: 20px; font-size: 14px;"> A new tutor has registered as a subject matter expert on your website. Kindly review it. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Name- <strong>%mentorName%</strong></div><div style="margin-bottom: 20px; font-size: 14px;"> Email- <a href="mailto:%mentorEmail%" style="color: #0091cf; text-decoration: none;">%mentorEmail%</a></div><div style="margin-top: 20px; font-size: 14px;"> Regards,<br><strong>Team Tutorioplus</strong></div></div>'
WHERE name = 'MENTOR_ADDED_EMAIL_TEMPLATE';

-- To ADMIN when a new student registers
INSERT INTO notification_templates (name, wildcards, subject, content)
VALUES 
(
  'ADDED_STUDENT_EMAIL_TEMPLATE',
  '["%studentName%", "%studentEmail%"]'::jsonb,
  'New Student Registration Update',
  '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>Tutorioplus Admin</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> A new student has successfully completed the registration on the website. Kindly visit your admin portal and review it. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Student's Name- <strong>%studentName%</strong></div><div style="margin-bottom: 20px; font-size: 14px;"> Student's Email- <a href="mailto:%studentEmail%" style="color: #0091cf; text-decoration: none;">%studentEmail%</a></div></div>'
);

-- To ADMIN when student submits an assignment
INSERT INTO notification_templates (name, wildcards, subject, content)
VALUES 
(
	'ASSIGNMENT_SUBMITTED_ADMIN_EMAIL_TEMPLATE',
	'["%studentName%", "%studentEmail%"]'::jsonb,
	'New Assignment Submission Update',
	'<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>Tutorioplus Admin</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> There is a new assignment submission by a student. Kindly review it at your earliest convenience. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Student's Name- <strong>%studentName%</strong></div><div style="margin-bottom: 20px; font-size: 14px;"> Student's Email- <a href="mailto:%studentEmail%" style="color: #0091cf; text-decoration: none;">%studentEmail%</a></div><div style="margin-top: 20px; font-size: 14px;"> Regards,<br><strong>Team Tutorioplus</strong></div></div>'
);

-- To STUDENT when they submit an assignment
INSERT INTO notification_templates (name, wildcards, subject, content)
VALUES 
(
  'ASSIGNMENT_SUBMITTED_STUDENT_EMAIL_TEMPLATE',
  '["%studentName%"]'::jsonb,
  'Assignment Submission Confirmation',
  '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> This is to confirm that we have successfully received your assignment submission. Our team will review your assignment and provide feedback soon. If there are any issues or additional instructions, we will contact you. </div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> Thank you for giving us the opportunity to serve you. </div><div style="margin-bottom: 15px; font-size: 14px;"> For Assistance? Please Contact us-<br><a href="mailto:support@tutorioplus.com" style="color: #0091cf; text-decoration: none;">support@tutorioplus.com</a></div><div style="margin-top: 20px; font-size: 14px;"> Best Wishes,<br><strong>Team Tutorioplus</strong><br><a href="https://www.tutorioplus.com/" style="color: #0091cf; text-decoration: none;" target="_blank">https://www.tutorioplus.com/</a></div></div>'
);

-- To STUDENT when they submit online class request and demo class request
INSERT INTO notification_templates (name, wildcards, subject, content)
VALUES 
(
  'SERVICE_ADDED_STUDENT_EMAIL_TEMPLATE',
  '["%studentName%", "%serviceName%", "%time%", "%duration%", "%topic%"]'::jsonb,
  '%serviceName% Confirmation',
  '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 20px; font-size: 14px;"> Your request for %serviceName% has successfully been registered. </div><div style="margin-bottom: 10px; font-size: 14px; color: #ff0000;"><strong>Details-</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Time- <strong>%time%</strong></div><div style="margin-bottom: 5px; font-size: 14px;"> Duration- <strong>%duration%</strong></div><div style="margin-bottom: 20px; font-size: 14px;"> Topic- <strong>%topic%</strong></div><div style="margin-top: 20px; font-size: 14px;"> Best Wishes,<br><strong>Team Tutorioplus</strong><br><a href="https://www.tutorioplus.com/" style="color: #0091cf; text-decoration: none;" target="_blank">https://www.tutorioplus.com/</a></div></div>'
);

-- TO STUDENT when they submit a grievance
INSERT INTO notification_templates (name, wildcards, subject, content)
VALUES 
INSERT INTO notification_templates (name, wildcards, subject, content)
VALUES 
(
  'GRIEVANCE_ADDED_STUDENT_EMAIL_TEMPLATE',
  '["%studentName%"]'::jsonb,
  'Acceptance of the Grievance',
  '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%studentName%</strong>,</div><div style="margin-bottom: 20px; font-size: 14px; text-align: justify;"> Your Grievance has successfully been registered on our platform. Our team will reach out to you soon and it will soon be resolved. </div><div style="margin-bottom: 20px; font-size: 14px;"><strong>Action-</strong><span style="color: #ff0000;"><strong>Pending</strong></span></div><div style="margin-bottom: 15px; font-size: 14px;"> Need Help? Please Contact us<br><a href="mailto:grievance@tutorioplus.com" style="color: #0091cf; text-decoration: none;">grievance@tutorioplus.com</a></div><div style="margin-top: 30px; font-size: 14px;"> Thanks and Regards,<br><strong>Team Tutorioplus</strong><br><a href="https://www.tutorioplus.com/" style="color: #0091cf; text-decoration: none;" target="_blank">https://www.tutorioplus.com/</a></div></div>'
);

-- TO Mentor when they register
INSERT INTO notification_templates (name, wildcards, subject, content)
VALUES 
INSERT INTO notification_templates (name, wildcards, subject, content)
VALUES 
(
  'MENTOR_ADDED_MENTOR_EMAIL_TEMPLATE',
  '["%mentorName%"]'::jsonb,
  'Successful Registration as Subject Matter Expert',
  '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%mentorName%</strong>,</div><div style="margin-bottom: 15px; font-size: 14px;"> Welcome to <strong>Tutorioplus</strong></div><div style="margin-bottom: 30px; font-size: 14px; text-align: justify;"> You have successfully registered as a subject matter expert on our portal. Our team will connect with you after your profile gets shortlisted. </div><div style="text-align: center; margin: 30px 0;"><a href="https://www.tutorioplus.com/" style=" background-color: #FFFF00; color: #000000; text-decoration: none; padding: 15px 25px; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block; border: 1px solid #DDDD00; " target="_blank">Want To Know More? Visit Us!</a></div><div style="margin-top: 30px; font-size: 14px;"> Thanks and Regards,<br><strong>Team Tutorioplus</strong></div></div>'
);

-- ON Approval Mentor should receive an email
INSERT INTO notification_templates (name, wildcards, subject, content)
VALUES 
INSERT INTO notification_templates (name, wildcards, subject, content)
VALUES 
(
  'MENTOR_APPROVED_EMAIL_TEMPLATE',
  '["%mentorName%"]'::jsonb,
  'Shortlisting of Profile',
  '<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.5;"><div style="margin-bottom: 15px; font-size: 14px;">Dear <strong>%mentorName%</strong>,</div><div style="margin-bottom: 15px; font-size: 14px;"> Congratulations! Your profile has been shortlisted. You are now a part of Tutorioplus. </div><div style="margin-bottom: 15px; font-size: 14px;"> Our team will connect with you over call to brief you about the work. </div><div style="margin-bottom: 30px; font-size: 14px;"> Excited! to have you on board. </div><div style="text-align: center; margin: 30px 0;"><a href="https://www.tutorioplus.com/" style=" background-color: #FFFF00; color: #000000; text-decoration: none; padding: 15px 25px; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block; border: 1px solid #DDDD00; " target="_blank">Want To Know More? Visit Us!</a></div><div style="margin-top: 30px; font-size: 14px;"> Best Wishes,<br><strong>Team Tutorioplus</strong></div></div>'
);
INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id)
SELECT 
    n.id,
    c.id,
    t.id
FROM notifications n
JOIN notification_templates t ON t.name = n.name || '_EMAIL_TEMPLATE'
JOIN notification_channels c ON c.name = 'EMAIL'
WHERE n.name IN (
  'ADDED_STUDENT',
  'ASSIGNMENT_SUBMITTED_ADMIN',
  'ASSIGNMENT_SUBMITTED_STUDENT',
  'SERVICE_ADDED_STUDENT',
  'GRIEVANCE_ADDED_STUDENT',
  'MENTOR_ADDED_MENTOR',
  'MENTOR_APPROVED'
);
