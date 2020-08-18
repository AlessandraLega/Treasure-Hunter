DROP TABLE IF EXISTS saved_searches;

CREATE TABLE saved_searches (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) NOT NULL,
    search VARCHAR NOT NULL CHECK (search != '')
);