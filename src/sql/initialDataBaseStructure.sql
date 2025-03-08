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
	email VARCHAR(50) NOT NULL UNIQUE,
	password TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE student_metadata (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,  
    country TEXT,  
    state TEXT,    
    city TEXT,     
    pincode VARCHAR(30),
	address TEXT,
	phone_number varchar(15),
    purpose_of_sign_in TEXT,
    first_payment_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE mentor_metadata (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,  
    phone_number VARCHAR(15),
    address TEXT,
    qualification TEXT,
    teaching_experience INT,
    job_type VARCHAR(20), 
    cv BYTEA,
    country TEXT,
    state TEXT, 
    city TEXT,  
    approve BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
    mentor_id INT,           
    service_id INT NOT NULL,           
    doc_path TEXT NOT NULL,            
    description TEXT,                  
    due_date TIMESTAMP,                
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    -- FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE session_based_services (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,                     
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

INSERT INTO roles (role) VALUES ('Mentor');

ALTER TABLE document_based_services
ADD CONSTRAINT fk_document_based_services_mentor
FOREIGN KEY (mentor_id) REFERENCES users(id)
ON DELETE SET NULL;

ALTER TABLE document_based_services
ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE users ADD COLUMN active BOOLEAN DEFAULT TRUE;

ALTER TABLE document_based_services 
ADD COLUMN answer_file_path TEXT,
ADD COLUMN answer_description TEXT;

ALTER TABLE grievances ADD COLUMN active BOOLEAN DEFAULT TRUE;

ALTER TABLE document_based_services
ADD COLUMN active BOOLEAN DEFAULT TRUE;

ALTER TABLE session_based_services
ADD COLUMN active BOOLEAN DEFAULT TRUE;

ALTER TABLE document_based_services 
ADD COLUMN subject TEXT;



/* for vivek */
ALTER TABLE document_based_services
ALTER COLUMN subject_id DROP NOT NULL;

ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

ALTER TABLE mentor_metadata DROP COLUMN active;

ALTER TABLE mentor_metadata ADD COLUMN approve BOOLEAN DEFAULT FALSE;

ALTER TABLE session_based_services 
DROP COLUMN mentor_id;

