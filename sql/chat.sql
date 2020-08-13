DROP TABLE IF EXISTS chat_messages;

CREATE TABLE chat_messages(
    id SERIAL PRIMARY KEY,
    message VARCHAR NOT NULL CHECK (message <> ''),
    sender_id INT NOT NULL REFERENCES users(id),
    recipient_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);