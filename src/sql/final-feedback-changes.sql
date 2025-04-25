ALTER TABLE demo_class_requests 
ADD COLUMN status varchar(30) DEFAULT 'Pending';

ALTER TABLE demo_class_requests 
ADD COLUMN rejection_reason Text;

CREATE TABLE adhoc_services (
	id SERIAL PRIMARY KEY,
	name TEXT,
	payment_id TEXT,
	created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

UPDATE notification_templates
SET 
  content = '<!DOCTYPE html><html lang="en"><body style=" margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, sans-serif; " ><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f6f8" ><tr><td align="center"><table width="650" cellpadding="0" cellspacing="0" border="1" style=" background-color: #fff; border: 1px solid #ccc; margin: 20px 0; " ><!-- Header section --><tr><td style="background-color: #4169e1; padding: 15px 20px"><table width="100%" cellpadding="0" cellspacing="0"><tr><td width="60%" style="vertical-align: middle"><table><tr><td><img src="https://tutorioplus.com/images/email.jpg" alt="Illustration" width="auto" height="80px" style="max-width: 100%; border-radius: 6px" /></td><td><h1 style=" margin: 0; font-size: 24px; line-height: 1.2; color: #ff7f50; font-weight: bold; " > Empowering Education<br />Through Tech </h1></td></tr></table></td><td width="60%" align="right" style="text-align: right; vertical-align: top" ><div style="color: #fff; font-size: 14px; text-align: right" ><img src="https://tutorioplus.com/images/logo_tuto.png" alt="Tutorioplus Logo" width="55" height="55" style="display: inline-block; vertical-align: middle" /><div style=" display: inline-block; vertical-align: middle; margin-left: 5px; " ><div style=" color: #ff7f50; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; line-height: 1; text-align: left; " > TUTORIOPLUS <div style=" font-size: 10px; color: #ff7f50; border-top: 1px solid #ff7f50; padding-top: 2px; margin-top: 2px; text-align: left; " > GLOBAL LEARNING PATH </div></div></div></div></td></tr></table></td></tr><!-- Body section --><tr><td style="padding: 20px 30px">%BODY%</td></tr><!-- Social media section --><tr><td style=" text-align: center; padding: 15px 20px; border-top: 1px solid #eee; " ><div>Follow Us On</div><div style="margin-top: 10px"><a href="#" style="display: inline-block; margin: 0 5px" target="_blank" rel="noopener noreferrer" ><img src="https://tutorioplus.com/images/icons/facebook.png" alt="Facebook" width="25" height="25" style="border-radius: 50%" /></a ><a href="https://www.instagram.com/tutorioplus/" style="display: inline-block; margin: 0 5px" target="_blank" rel="noopener noreferrer" ><img src="https://tutorioplus.com/images/icons/instagram.png" alt="Instagram" width="25" height="25" style="border-radius: 50%" /></a ><a href="https://www.youtube.com/@Tutorioplus" style="display: inline-block; margin: 0 5px" target="_blank" rel="noopener noreferrer" ><img src="https://tutorioplus.com/images/icons/video.png" alt="YouTube" width="25" height="25" style="border-radius: 50%" /></a ><br /><p style="text-align: center; padding: 10px; font-size: 14px"> &copy;2025 Tutorioplus Pvt. Ltd. All rights reserved. </p></div></td></tr></table></td></tr></table></body></html>'
WHERE 
  name = 'BASE_TEMPLATE';