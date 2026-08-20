CREATE TABLE users (
  id CHAR(26) PRIMARY KEY,
  email VARCHAR(254) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  is_activated BOOLEAN NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT users_email_lowercase CHECK (email = lower(email))
);

CREATE UNIQUE INDEX users_email_key ON users (email);
