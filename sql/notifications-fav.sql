DROP TABLE IF EXISTS notifications_fav;

CREATE TABLE notifications_fav( 
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    item_id INT NOT NULL REFERENCES items(id),
    read BOOLEAN DEFAULT false
);