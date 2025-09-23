-- SQL script to create tables for contacts-app
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    twitter VARCHAR(255),
    avatar VARCHAR(255),
    notes TEXT,
    favorite BOOLEAN DEFAULT FALSE
);
