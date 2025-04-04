CREATE TABLE demo_class_requests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  course TEXT NOT NULL,
  subject TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  education TEXT NOT NULL,
  country TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);