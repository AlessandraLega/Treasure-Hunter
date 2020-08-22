DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL CHECK (comment <> ''),
    sender_id INT NOT NULL REFERENCES users(id),
    item_id INT NOT NULL REFERENCES items(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);