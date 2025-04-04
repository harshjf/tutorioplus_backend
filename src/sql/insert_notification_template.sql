ALTER TABLE notification_templates ALTER COLUMN wildcards TYPE jsonb USING wildcards::jsonb;

INSERT INTO notifications (name, category) VALUES
('SERVICE_ADDED', 'SERVICE'),
('MENTOR_ADDED', 'MENTOR'),
('ADDED_OTHER_SERVICE', 'SERVICE'),
('ONBOARDING', 'USER'),
('GRIEVANCE_ADDED', 'GRIEVANCE'),
('ASSIGNMENT_ANSWERED', 'ASSIGNMENT'),
('FORGOT_PASSWORD', 'USER');


INSERT INTO notification_templates (name, wildcards, subject, content) VALUES
('SERVICE_ADDED_EMAIL_TEMPLATE', '["%userName%", "%serviceName%"]'::jsonb, 'New Service Request Added',
'<p><strong>%userName%</strong> has added a new service request for <strong>%serviceName%</strong>.</p><p>Please log in to the admin dashboard to review and take the necessary actions.</p>'),

('MENTOR_ADDED_EMAIL_TEMPLATE', '["%mentorName%"]'::jsonb, 'Mentor Request Submitted',
'<p><strong>%mentorName%</strong> has submitted a request to become a mentor.</p><p>Please log in to the admin dashboard to review their details and take the necessary action.</p>'),

('ADDED_OTHER_SERVICE_EMAIL_TEMPLATE', '["%userName%", "%amount%"]'::jsonb, 'Other Service Payment Received',
'<p>Someone named <strong>%userName%</strong> has paid <strong>%amount%</strong> for a service request.</p><p>Please check the payment details and reach out to the user if needed.</p>'),

('ONBOARDING_EMAIL_TEMPLATE', '["%studentName%"]'::jsonb, 'Welcome to Tutorioplus!',
'<p>Hey <strong>%studentName%</strong>,</p><p>Welcome to <strong>Tutorioplus</strong>!<br>We’re super excited to have you onboard and help you throughout your learning journey.</p><p>If you run into any difficulties, feel free to reach out to us at <a href="mailto:support@tutorioplus.com">support@tutorioplus.com</a> — we’ll do our best to assist you as quickly as possible.</p><p>Let’s make learning awesome together!</p>'),

('GRIEVANCE_ADDED_EMAIL_TEMPLATE', '["%studentName%"]'::jsonb, 'Student Grievance Submitted',
'<p><strong>%studentName%</strong> has raised a grievance.</p><p>Please log in to the admin dashboard to review and address the issue.</p>'),
(
  'ASSIGNMENT_ANSWERED_EMAIL_TEMPLATE',
  '["%studentName%"]'::jsonb,
  'Your Assignment Has Been Answered',
  '<p>Hi <strong>%studentName%</strong>,</p><p>We’re happy to let you know that your assignment has been reviewed and answered by one of our mentors.</p><p>Please log in to your Tutorioplus account and visit the "My Assignments" section to view the full response and feedback.</p><p>If you need any help or have further questions, feel free to reach out to our support team at <a href="mailto:support@tutorioplus.com">support@tutorioplus.com</a>.</p><p>Thanks for learning with us!</p><p>– Team Tutorioplus</p>'
),
(
  'FORGOT_PASSWORD_EMAIL_TEMPLATE',
  '["%resetLink%"]'::jsonb,
  'Reset Your Password',
  '<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="%resetLink%">Reset Password</a></p>'
);


INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id)
SELECT 
    n.id,
    c.id,
    t.id
FROM notifications n
JOIN notification_templates t ON t.name = n.name || '_EMAIL_TEMPLATE'
JOIN notification_channels c ON c.name = 'EMAIL';

INSERT INTO notification_templates("name", "wildcards", "subject", "content") VALUES('BASE_TEMPLATE', '["%BODY%"]', 'Base Template', '<!DOCTYPE html><html lang="en"><body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f6f8"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;border-radius:8px;margin:20px 0;box-shadow:0 0 10px rgba(0,0,0,.05)"><tr><td style="background-color:#ffebe0;padding:40px 30px"><table width="100%" cellpadding="0" cellspacing="0"><tr><td width="60%" style="color:#eb7c3a;padding-right:20px;vertical-align:top"><table width="100%"><tr><td align="left" style="padding-bottom:5px"><img src="https://tutorioplus.com/images/logo_tuto.png" alt="Tutorioplus Logo" width="100"></td></tr><tr><tr><td style="padding-top:5px"><h1 style="margin:0 0 15px;font-size:26px;line-height:1.2">Empowering education through tech</h1></td></tr></table></td><td width="40%" align="right" style="text-align:right"><img src="https://tutorioplus.com/images/email.jpg" alt="Illustration" width="auto" height="180px" style="max-width:100%;border-radius:6px"></td></tr></table></td></tr><tr><td style="padding:30px">%BODY%</td></tr><tr><td style="background-color:#eee;text-align:center;padding:20px;font-size:14px;color:#777">&copy; 2025 Tutorioplus Pvt. Ltd. All rights reserved.<br><a href="https://tutorioplus.com" style="color:#0091cf;text-decoration:none">tutorioplus.com</a></td></tr></table></td></tr></table></body></html>');
