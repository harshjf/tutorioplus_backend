CREATE TABLE service_metadata (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    title VARCHAR(255),
    heading VARCHAR(100),
    sub_heading TEXT,
    button_text VARCHAR(100),
    review_text VARCHAR(100),
    background_image TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE service_details (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    title VARCHAR(255),
    image TEXT,
    paragraphs JSONB,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE service_steps (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    title VARCHAR(255),
    steps JSONB, -- Array of objects with { number, title, description }
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE guarantee_sections (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    title VARCHAR(255),
    subtitle TEXT,
    icon_name VARCHAR(100)
);

CREATE TABLE bonuses (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    title VARCHAR(255),
    subtitle TEXT,
    icon_name VARCHAR(100)
);

CREATE TABLE university_sections (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    trust_text TEXT,
    grid_title TEXT,
    grid_description TEXT
);

CREATE TABLE universities (
    id SERIAL PRIMARY KEY,
    university_section_id INTEGER REFERENCES university_sections(id) ON DELETE CASCADE,
    name VARCHAR(255),
    image TEXT
);

CREATE TABLE assignment_help_content (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    bullet_points JSONB,
    button_text VARCHAR(100)
);


INSERT INTO service_metadata (service_id, title, heading, sub_heading, button_text, review_text, background_image, created_at, updated_at)
SELECT id, 'Assignment Assistance', 'Online Help', 'Get top-quality academic assistance with online assignment help services',
       'Get Online Assignment Help', '1.1 M+ Happy Students', '/images/services-details-image/ed-tech.png',
       now(), now()
FROM services
WHERE service_type = 'Assignment';

INSERT INTO service_metadata (service_id, title, heading, sub_heading, button_text, review_text, background_image, created_at, updated_at)
SELECT id, 'Homework Assistance', 'Online Help', 'Get top-quality academic assistance with online homework help services',
       'Get Online Homework Help', '1.1 M+ Happy Students', '/images/services-details-image/homework.jpg',
       now(), now()
FROM services
WHERE service_type = 'Homework';

INSERT INTO service_metadata (service_id, title, heading, sub_heading, button_text, review_text, background_image, created_at, updated_at)
SELECT id, 'Lab Report Assistance', 'Online Help', 'Get top-quality academic assistance with online lab report help services',
       'Get Online Lab Report Help', '1.1 M+ Happy Students', '/images/services-details-image/lab_report.jpg',
       now(), now()
FROM services
WHERE service_type = 'Lab Report';

INSERT INTO service_metadata (service_id, title, heading, sub_heading, button_text, review_text, background_image, created_at, updated_at)
SELECT id, 'Project Report Assistance', 'Online Help', 'Get top-quality academic assistance with online project report help services',
       'Get Online Project Report Help', '1.1 M+ Happy Students', '/images/services-details-image/project_report.jpg',
       now(), now()
FROM services
WHERE service_type = 'Project Report';

INSERT INTO service_metadata (service_id, title, heading, sub_heading, button_text, review_text, background_image, created_at, updated_at)
SELECT id, 'Counselling Assistance', 'Online Help', 'Get top-quality academic assistance with online counselling help services',
       'Get Online Counselling Help', '1.1 M+ Happy Students', '/images/services-details-image/counselling1.jpg',
       now(), now()
FROM services
WHERE service_type = 'Counselling';

INSERT INTO service_metadata (service_id, title, heading, sub_heading, button_text, review_text, background_image, created_at, updated_at)
SELECT id, 'Live Session Assistance', 'Online Help', 'Get top-quality academic assistance with live session help services',
       'Get Online Live Session Help', '1.1 M+ Happy Students', '/images/services-details-image/live.jpg',
       now(), now()
FROM services
WHERE service_type = 'Live Session';

INSERT INTO service_details (service_id, title, image, paragraphs, created_at, updated_at)
SELECT id, 'Is Demand For Online Assignment Help Rising?', '/images/services-details-image/assignment.jpg', '["The onset of COVID-19 caused a tremendous change in students'' lives. The education system is undergoing a transformation due to online learning help. The mentality of achieving educational growth beyond boundaries has markedly changed students'' behavior. They are now aware of their knowledge gap, restricted time frame, and other challenges that stop them from achieving academic success. Students are becoming independent enough to seek expert assignment help services. Thanks to EdTech, students are becoming conscious of their educational demands. They know when they need help in assignments to understand the academic requirements.", "The realization was there during this decade, but the pace of change occurred due to the Covid scenario. Most students started depending on the online learning platform during that time and noticed remarkable progress. As per statistics, 53% of university and advanced study pursuers are leaning toward assignment help services to improve their learning capabilities. 56% of students say that opting for help with assignments aided them in overcoming stress and boosting their performance. Assignment services make their education effective and ease the pressure of studying.", "There are many other countries where students get in touch with the Tutorioplus student assignment help platform for their college assignments. It''s our specialty to treat every student equally and try our best to offer assignment services, even at odd hours.", "All these facts & figures reflect that assignment help services are becoming one of the best options for students to reach their desired goals. These are enough to prove why students nowadays prefer online assignment helper services. It also reflects that the service is experiencing a sharp rise in demand."]'::jsonb, now(), now()
FROM services
WHERE service_type = 'Assignment';

INSERT INTO service_details (service_id, title, image, paragraphs, created_at, updated_at)
SELECT id, 'Is Demand For Online Homework Help Rising?', '/images/services-details-image/assignment.jpg', '["Recognizing the challenges students face with daily homework, Tutorioplus provides expert guidance to help them grasp concepts and complete tasks efficiently.", "By offering step-by-step explanations, Tutorioplus tutors make even the most challenging topics easier to grasp. This approach enhances students'' comprehension, enabling them to apply concepts confidently in exams and class discussions. Access to expert guidance empowers students to improve their academic performance consistently.", "Another key benefit of online homework help is flexibility. Students can seek assistance at any time, ensuring they never fall behind in their studies. Tutorioplus offers 24/7 support, making learning accessible and stress-free for students worldwide.", "The impact of quality homework help extends beyond academic grades. It instills a sense of discipline, enhances critical thinking, and boosts students'' confidence in their abilities. With Tutorioplus, students receive the necessary support to excel academically while developing essential lifelong skills."]'::jsonb, now(), now()
FROM services
WHERE service_type = 'Homework';

INSERT INTO service_details (service_id, title, image, paragraphs, created_at, updated_at)
SELECT id, 'Is Demand For Online Lab Report Help Rising?', '/images/services-details-image/assignment.jpg', '["For students engaged in scientific studies, crafting detailed lab reports can be daunting. Tutorioplus aids in structuring and presenting experimental findings effectively.", "With online lab report help, students can overcome common challenges such as incorrect calculations, unclear results, and formatting errors. Tutorioplus tutors provide thorough reviews and feedback, ensuring that students refine their reports to meet academic standards.", "Beyond immediate academic benefits, lab report assistance fosters essential scientific writing skills. These skills are invaluable for students pursuing careers in research, engineering, and healthcare. Tutorioplus empowers students with the knowledge and expertise needed for success in their academic and professional journeys.", "Additionally, lab report guidance enhances students\u2019 ability to analyze and interpret experimental data. By learning proper documentation techniques and data analysis methods, students develop a scientific mindset that prepares them for future academic and professional challenges. With Tutorioplus, students receive expert support in crafting detailed, accurate, and well-presented lab reports."]'::jsonb, now(), now()
FROM services
WHERE service_type = 'Lab Report';

INSERT INTO service_details (service_id, title, image, paragraphs, created_at, updated_at)
SELECT id, 'Is Demand For Online Project Report Help Rising?', '/images/services-details-image/assignment.jpg', '["Project reports play a significant role in academic assessments, requiring in-depth research and structured writing. Many students struggle with compiling data and presenting it cohesively. Tutorioplus provides professional project report writing assistance, ensuring well-researched and organized content.", "The realization was there during this decade, but the pace of change occurred due to the Covid scenario. Most students started depending on the online learning platform during that time and noticed remarkable progress. As per statistics, 53% of university and advanced study pursuers are leaning toward assignment help services to improve their learning capabilities. 56% of students say that opting for help with assignments aided them in overcoming stress and boosting their performance. Assignment services make their education effective and ease the pressure of studying.", "Effective project reports require critical thinking, analysis, and proper documentation. Tutorioplus tutors guide students in structuring their reports logically, ensuring clarity and coherence. This expert support helps students present their ideas effectively and earn higher grades.", "By utilizing professional project report help, students enhance their research capabilities and presentation skills. These skills are valuable not only in academics but also in professional careers, making Tutorioplus an essential resource for students aiming for excellence."]'::jsonb, now(), now()
FROM services
WHERE service_type = 'Project Report';

INSERT INTO service_details (service_id, title, image, paragraphs, created_at, updated_at)
SELECT id, 'Is Demand For Online Counselling Help Rising?', '/images/services-details-image/assignment.jpg', '["Academic challenges often extend beyond coursework, affecting students'' mental well-being and motivation. Many students struggle with stress, self-doubt, and time management issues. Tutorioplus offers counseling services to support students in overcoming these obstacles and achieving their full potential.", "Educational counseling provides personalized guidance, helping students navigate their academic journeys effectively. Tutorioplus counselors offer insights on study techniques, goal setting, and stress management, equipping students with the tools they need for success.", "Another crucial aspect of academic counseling is career guidance. Many students face uncertainty about their future career paths and require expert advice. Tutorioplus connects students with experienced counselors who provide valuable career insights and recommendations tailored to their strengths and interests.", "With professional counseling services, students gain clarity and confidence in their academic and career choices. This holistic support system ensures that students not only excel academically but also develop the mindset and strategies needed for long-term success."]'::jsonb, now(), now()
FROM services
WHERE service_type = 'Counselling';

INSERT INTO service_details (service_id, title, image, paragraphs, created_at, updated_at)
SELECT id, 'Is Demand For Online Live Session Help Rising?', '/images/services-details-image/assignment.jpg', '["Live tutoring sessions have revolutionized online learning, providing students with real-time interaction and personalized guidance. Tutorioplus offers live session support, allowing students to clarify doubts instantly and enhance their understanding of complex topics.", "One of the key benefits of live sessions is immediate feedback. Unlike pre-recorded lectures, live tutoring enables students to ask questions and receive instant explanations. This interactive approach improves comprehension and boosts academic performance.", "Live sessions are particularly beneficial for subjects requiring problem-solving, such as mathematics and science. Tutorioplus tutors use interactive tools to demonstrate concepts, making learning more engaging and effective. Students can revisit recorded sessions for revision, ensuring better retention.", "With flexible scheduling and expert guidance, live tutoring sessions bridge the gap between traditional and digital learning. Tutorioplus ensures that students receive the support they need, empowering them to excel in their studies and develop a deeper love for learning."]'::jsonb, now(), now()
FROM services
WHERE service_type = 'Live Session';

INSERT INTO service_steps (service_id, title, steps, created_at, updated_at)
SELECT id, 'Offering Student University Assignment Help In 4 Simple Steps', '[{"number": 1, "title": "Sign up", "description": "Fill in your details at https://Tutorioplus.com/auth/signup to complete the sign-up process."}, {"number": 2, "title": "Place your order", "description": "On the dashboard, place the order for assignment service and upload your queries."}, {"number": 3, "title": "Make Payment", "description": "Depending on your order, you will receive the price quotation and a payment link. Make the payment."}, {"number": 4, "title": "Get Solution", "description": "Once you confirm the payment, our experts will start working on your assignment."}]'::jsonb, now(), now()
FROM services
WHERE service_type = 'Assignment';

INSERT INTO service_steps (service_id, title, steps, created_at, updated_at)
SELECT id, 'Offering Student University Assignment Help In 4 Simple Steps', '[{"number": 1, "title": "Sign up", "description": "Fill in your details at https://Tutorioplus.com/auth/signup to complete the sign-up process."}, {"number": 2, "title": "Place your order", "description": "On the dashboard, place the order for assignment service and upload your queries."}, {"number": 3, "title": "Make Payment", "description": "Depending on your order, you will receive the price quotation and a payment link. Make the payment."}, {"number": 4, "title": "Get Solution", "description": "Once you confirm the payment, our experts will start working on your assignment."}]'::jsonb, now(), now()
FROM services
WHERE service_type = 'Homework';

INSERT INTO service_steps (service_id, title, steps, created_at, updated_at)
SELECT id, 'Offering Student University Assignment Help In 4 Simple Steps', '[{"number": 1, "title": "Sign up", "description": "Fill in your details at https://Tutorioplus.com/auth/signup to complete the sign-up process."}, {"number": 2, "title": "Place your order", "description": "On the dashboard, place the order for assignment service and upload your queries."}, {"number": 3, "title": "Make Payment", "description": "Depending on your order, you will receive the price quotation and a payment link. Make the payment."}, {"number": 4, "title": "Get Solution", "description": "Once you confirm the payment, our experts will start working on your assignment."}]'::jsonb, now(), now()
FROM services
WHERE service_type = 'Lab Report';

INSERT INTO service_steps (service_id, title, steps, created_at, updated_at)
SELECT id, 'Offering Student University Assignment Help In 4 Simple Steps', '[{"number": 1, "title": "Sign up", "description": "Fill in your details at https://Tutorioplus.com/auth/signup to complete the sign-up process."}, {"number": 2, "title": "Place your order", "description": "On the dashboard, place the order for assignment service and upload your queries."}, {"number": 3, "title": "Make Payment", "description": "Depending on your order, you will receive the price quotation and a payment link. Make the payment."}, {"number": 4, "title": "Get Solution", "description": "Once you confirm the payment, our experts will start working on your assignment."}]'::jsonb, now(), now()
FROM services
WHERE service_type = 'Project Report';

INSERT INTO service_steps (service_id, title, steps, created_at, updated_at)
SELECT id, 'Offering Student University Assignment Help In 4 Simple Steps', '[{"number": 1, "title": "Sign up", "description": "Fill in your details at https://Tutorioplus.com/auth/signup to complete the sign-up process."}, {"number": 2, "title": "Place your order", "description": "On the dashboard, place the order for assignment service and upload your queries."}, {"number": 3, "title": "Make Payment", "description": "Depending on your order, you will receive the price quotation and a payment link. Make the payment."}, {"number": 4, "title": "Get Solution", "description": "Once you confirm the payment, our experts will start working on your assignment."}]'::jsonb, now(), now()
FROM services
WHERE service_type = 'Counselling';

INSERT INTO service_steps (service_id, title, steps, created_at, updated_at)
SELECT id, 'Offering Student University Assignment Help In 4 Simple Steps', '[{"number": 1, "title": "Sign up", "description": "Fill in your details at https://Tutorioplus.com/auth/signup to complete the sign-up process."}, {"number": 2, "title": "Place your order", "description": "On the dashboard, place the order for assignment service and upload your queries."}, {"number": 3, "title": "Make Payment", "description": "Depending on your order, you will receive the price quotation and a payment link. Make the payment."}, {"number": 4, "title": "Get Solution", "description": "Once you confirm the payment, our experts will start working on your assignment."}]'::jsonb, now(), now()
FROM services
WHERE service_type = 'Live Session';

INSERT INTO guarantee_sections (service_id, title, subtitle, icon_name)
SELECT id, 'Detailed solution with clarity', 'We assign expert tutors to ensure students get detailed, step-by-step solutions for your assignments.', 'LightbulbOutlinedIcon' FROM services;

INSERT INTO guarantee_sections (service_id, title, subtitle, icon_name)
SELECT id, 'Error-free work with Original Work', 'Get a 100 percent original and accurate solution with a personalized touch by our experts.', 'ErrorOutlineOutlinedIcon' FROM services;

INSERT INTO guarantee_sections (service_id, title, subtitle, icon_name)
SELECT id, 'Unlimited rewrites', 'You get unlimited rewrites from our team once experts upload your homework solution to the dashboard.', 'EditOutlinedIcon' FROM services;

INSERT INTO guarantee_sections (service_id, title, subtitle, icon_name)
SELECT id, 'Solid Boost in grades', 'Tutorioplus help with homework to provide you the scope to secure better grades for your assignments.', 'GradeOutlinedIcon' FROM services;

INSERT INTO guarantee_sections (service_id, title, subtitle, icon_name)
SELECT id, 'Money Back guarantee', 'In case of dissatisfaction with the given solution, you can claim a full refund.', 'CurrencyExchangeOutlinedIcon' FROM services;

INSERT INTO guarantee_sections (service_id, title, subtitle, icon_name)
SELECT id, 'Timely submission', 'Our tutors work on your projects to provide you with on-time assignment help.', 'AccessTimeOutlinedIcon' FROM services;

INSERT INTO bonuses (service_id, title, subtitle, icon_name)
SELECT id, '₹20 reward', 'upon registration', 'EmojiEventsOutlinedIcon' FROM services;

INSERT INTO bonuses (service_id, title, subtitle, icon_name)
SELECT id, 'Multiple Experts', 'for Assignment', 'PeopleOutlinedIcon' FROM services;

INSERT INTO bonuses (service_id, title, subtitle, icon_name)
SELECT id, 'Original Work', 'reports', 'AssessmentOutlinedIcon' FROM services;

INSERT INTO bonuses (service_id, title, subtitle, icon_name)
SELECT id, 'Unlimited', 'rewrites/revisions', 'ReplayIcon' FROM services;

INSERT INTO bonuses (service_id, title, subtitle, icon_name)
SELECT id, 'Free Citation', 'and references', 'DescriptionOutlinedIcon' FROM services;

INSERT INTO bonuses (service_id, title, subtitle, icon_name)
SELECT id, 'Lifetime Access', 'to your solutions', 'DateRangeOutlinedIcon' FROM services;

INSERT INTO bonuses (service_id, title, subtitle, icon_name)
SELECT id, 'Moneyback', 'guarantee', 'CurrencyExchangeOutlinedIcon' FROM services;

INSERT INTO bonuses (service_id, title, subtitle, icon_name)
SELECT id, 'Redeemable', 'reward points', 'RedeemOutlinedIcon' FROM services;

INSERT INTO university_sections (service_id, trust_text, grid_title, grid_description)
SELECT id, 
       'Trusted by 100,000+ students Worldwide',
       'Tutorioplus University Assignment Help - A Name University Students Trust',
       'More than 100,000 students from the following prestigious universities trusted Tutorioplus for their assignments. We ensured that they achieved the desired success in academics.'
FROM services;

INSERT INTO universities (university_section_id, name, image)
SELECT us.id, 'National University of Singapore (NUS)', '/images/university/singapore.jpg'
FROM university_sections us
JOIN services s ON us.service_id = s.id;

INSERT INTO universities (university_section_id, name, image)
SELECT us.id, 'University of Toronto', '/images/university/toronto.jpg'
FROM university_sections us
JOIN services s ON us.service_id = s.id;

INSERT INTO universities (university_section_id, name, image)
SELECT us.id, 'Kuwait University​', '/images/university/kuwait.jpg'
FROM university_sections us
JOIN services s ON us.service_id = s.id;

INSERT INTO universities (university_section_id, name, image)
SELECT us.id, 'Cranfield University​', '/images/university/cranfield.jpg'
FROM university_sections us
JOIN services s ON us.service_id = s.id;

INSERT INTO universities (university_section_id, name, image)
SELECT us.id, 'University of Jeddah', '/images/university/jeddah.jpg'
FROM university_sections us
JOIN services s ON us.service_id = s.id;

INSERT INTO universities (university_section_id, name, image)
SELECT us.id, 'University of Adelaide​', '/images/university/adelaide.jpg'
FROM university_sections us
JOIN services s ON us.service_id = s.id;

INSERT INTO universities (university_section_id, name, image)
SELECT us.id, 'Applied Science University (Bahrain)​', '/images/university/asu.jpg'
FROM university_sections us
JOIN services s ON us.service_id = s.id;

INSERT INTO universities (university_section_id, name, image)
SELECT us.id, 'Aston University', '/images/university/aston.jpeg'
FROM university_sections us
JOIN services s ON us.service_id = s.id;

INSERT INTO universities (university_section_id, name, image)
SELECT us.id, 'Arizona State University', '/images/university/azu.jpg'
FROM university_sections us
JOIN services s ON us.service_id = s.id;

INSERT INTO universities (university_section_id, name, image)
SELECT us.id, 'Qatar Univeristy', '/images/university/qatar.jpg'
FROM university_sections us
JOIN services s ON us.service_id = s.id;

INSERT INTO assignment_help_content (service_id, title, description, bullet_points, button_text)
SELECT id, 
       'Who Is This Online Help For?',
       'Students undergo countless struggles while they are in their college. These issues complicate their academic life. If you are also facing academic problems and wondering who can help me with my assignment, we’re here. We solve these problems for you.',
       '["\u2714\ufe0f You don\u2019t understand your subjects", "\u2714\ufe0f Don\u2019t have enough time/You have a part-time job", "\u2714\ufe0f You have a deadline that you are going to miss", "\u2714\ufe0f You are lagging behind your classmates", "\u2714\ufe0f GPA/Grades are going down & you need improvement", "\u2714\ufe0f Lack of good tutors in college/university"]'::jsonb,
       'Yes, Get Help'
FROM services;