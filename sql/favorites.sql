DROP TABLE IF EXISTS favorites;

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    item_id INT NOT NULL REFERENCES items(id)
);