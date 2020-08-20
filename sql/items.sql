DROP TABLE IF EXISTS items;

CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    picture_url TEXT NOT NULL CHECK (picture_url != ''),
    description VARCHAR,
    address VARCHAR NOT NULL CHECK (address != ''),
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);