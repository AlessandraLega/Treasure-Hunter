DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR NOT NULL CHECK (first !=''),
    last VARCHAR NOT NULL CHECK (last !=''),
    email VARCHAR NOT NULL CHECK (email !=''),
    password VARCHAR NOT NULL CHECK (password !=''),
    profile_pic TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);