ALTER TABLE document_based_services 
ADD COLUMN answer_submitted_at TIMESTAMP;

ALTER TABLE grievances
DROP COLUMN service_id;

ALTER TABLE student_metadata
ADD COLUMN country_code VARCHAR(10);

ALTER TABLE session_based_services 
ADD COLUMN subject text;

ALTER TABLE session_based_services
ADD COLUMN status TEXT NOT NULL DEFAULT 'Pending';

ALTER TABLE mentor_metadata
ADD COLUMN country_code VARCHAR(10);

CREATE TABLE payment_history (
	id SERIAL PRIMARY KEY,
	student_id INT REFERENCES users(id) ON DELETE CASCADE,
	payment_id TEXT NOT NULL,
	amount NUMERIC(10, 2) NOT NULL,
	date TIMESTAMP DEFAULT NOW()
);

ALTER TABLE session_based_services
ADD COLUMN payment_id TEXT;