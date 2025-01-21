CREATE TABLE roles (
	id SERIAL PRIMARY KEY,
	role VARCHAR(50) NOT NULL UNIQUE,
	description VARCHAR(150),
	created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO roles (role, description)
VALUES ('Admin', 'Administrator with full access');

INSERT INTO roles(role,description)
VALUES ('STUDENT',null);

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	role_id INT REFERENCES roles(id),
	name TEXT,
	email VARCHAR(50) NOT NULL,
	password TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
	dial_code varchar(5) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, 
    country_id INT REFERENCES countries(id) ON DELETE CASCADE, 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, 
    state_id INT REFERENCES states(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO subjects (name) VALUES
('Academic Writing'),('Accountancy'), ('Algorithm and Data Structure'), ('Analog Electronics'),
('AutoCAD'), ('Basic Electronics'), ('BioChemistry'), ('Biology'), ('Biotechnology'), ('Business Management'),
('C/C++'), ('C#'), ('Chemistry'), ('Civil Engineering'), ('Commerce'), ('Communication Skills'), ('Company Law'),
('Computer Networking'), ('Computer Science'), ('Control Systems'), ('DBMS'), ('Digital Electronics'),
('.net'), ('Economics'), ('Electrical Engineering'), ('Engineering Mechanics'), ('English'),
('Environmental Science'), ('Financial Management'), ('Fluid Mechanics'), ('Geography'), ('History'), ('HTML'),
('IELTS'), ('Income Tax'), ('JAVA'), ('Jquery and JavaScript'), ('Law'), ('Maths'), ('Mechanical'),
('Microbiology'), ('PHP'), ('Physics'), ('Political Science'), ('Programming'), ('Psychology'),('Phython'), ('R'),
('Science'), ('Sociology'),('Statistics'),('Strength of Materials'), ('Thermodynamics'),('Zoology');

CREATE TABLE student_metadata (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,  
    country_id INT,  
    state_id INT,    
    city_id INT,     
    pincode VARCHAR(30),
	address TEXT,
	phone_number varchar(15),
    purpose_of_sign_in TEXT,
    first_payment_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    --FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL,
    --FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE SET NULL,
    --FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL
);

CREATE TABLE mentor_metadata (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL, 
    subject_id INT NOT NULL, 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, 
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE 
);

CREATE TABLE news_announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active',  -- 'active', 'archived', 'expired'
	created_by INT NOT NULL, 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE FAQs (
    id SERIAL PRIMARY KEY,  
    title VARCHAR(255) NOT NULL,       
    description TEXT NOT NULL,          
    priority INT NOT NULL       
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    service_type VARCHAR(50) NOT NULL,  -- Example: 'homework', 'counseling', etc.
    category VARCHAR(50) NOT NULL,     -- Example: 'documentBased', 'sessionBased'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE document_based_services (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,          
	subject_id INT NOT NULL,
    mentor_id INT,           
    service_id INT NOT NULL,           
    doc_path TEXT NOT NULL,            
    description TEXT,                  
    due_date TIMESTAMP,                
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    -- FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
	FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE session_based_services (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,           
    mentor_id INT, --NOT NULL,            
    service_id INT NOT NULL,          
    schedule_time TIMESTAMP NOT NULL,  
    duration TEXT NOT NULL,             
    link TEXT,                         
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    --FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE grievances (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES users(id) ON DELETE CASCADE,
    service_id INT REFERENCES services(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE newsandannouncements (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE  reset_password(
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES users(id) ON DELETE CASCADE,
    token_value TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL,
	is_used Boolean DEFAULT FALSE
);