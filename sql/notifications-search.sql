DROP TABLE IF EXISTS notifications_search;

CREATE TABLE notifications_search( 
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    search VARCHAR NOT NULL,
    item_id INT NOT NULL REFERENCES items(id),
    read BOOLEAN DEFAULT false
);