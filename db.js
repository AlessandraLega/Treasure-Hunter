var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:alessandra:postgres@localhost:5432/treasurehunter"
);

//sudo service postgresql start

module.exports.addUser = function (first, last, email, hashedPw) {
    let q = `INSERT INTO users (first, last, email, password)
            VALUES ($1, $2, $3, $4) RETURNING id`;
    let params = [first, last, email, hashedPw];
    return db.query(q, params);
};

module.exports.getHashedPw = function (email) {
    let q = `SELECT password, id FROM users
            WHERE email = $1`;
    let params = [email];
    return db.query(q, params);
};

module.exports.checkIfUserExists = function (email) {
    let q = `SELECT id FROM users
            WHERE email = $1`;
    let params = [email];
    return db.query(q, params);
};

module.exports.addCode = function (email, secretCode) {
    let q = `INSERT INTO reset_codes(email, code)
            VALUES ($1, $2)`;
    let params = [email, secretCode];
    return db.query(q, params);
};

module.exports.checkCode = function (email) {
    let q = `SELECT code FROM reset_codes 
            WHERE email = $1 AND 
            CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
            ORDER BY created_at DESC
            LIMIT 1`;
    let params = [email];
    return db.query(q, params);
};

module.exports.changePassword = function (email, newPassword) {
    let q = `UPDATE users
            SET password=$2
            WHERE email =$1`;
    let params = [email, newPassword];
    return db.query(q, params);
};

module.exports.addItem = function (url, description, address, id, lat, lng) {
    return db.query(
        `INSERT INTO items (picture_url, description, address, user_id, lat, lng)
                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, description`,
        [url, description, address, id, lat, lng]
    );
};

module.exports.getLastItems = function () {
    let q = `SELECT * FROM items
    ORDER BY created_at DESC`;
    //WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '24 hours'
    return db.query(q);
};

module.exports.getSearch = function (search) {
    return db.query(
        `SELECT * FROM items
            WHERE description
            ILIKE $1
            OR description
            ILIKE $2
            OR description
            ILIKE $3
            ORDER BY created_at DESC`,
        [search + "%", "%" + search, "%" + search + "%"]
    );
};

module.exports.addSearch = function (search, id) {
    return db.query(
        `INSERT INTO saved_searches (search, user_id)
        VALUES ($1, $2)`,
        [search, id]
    );
};

module.exports.getLastThree = function (search) {
    return db.query(
        `SELECT picture_url, id FROM items 
        WHERE description ILIKE $1 
        OR description ILIKE $2 
        OR description ILIKE $3
        OR description ILIKE $4
        ORDER BY created_at DESC
        LIMIT 3`,
        [search + "%", "%" + search, "%" + search + "%", search]
    );
};

module.exports.getSaved = function (id) {
    return db.query(
        `SELECT DISTINCT search FROM saved_searches
        WHERE user_id=$1`,
        [id]
    );
};

module.exports.removeFromSearch = function (item) {
    return db.query(`DELETE FROM saved_searches WHERE search ILIKE $1`, [item]);
};

module.exports.getItem = function (id) {
    return db.query(`SELECT * FROM items WHERE id=$1`, [id]);
};

module.exports.getAll = function () {
    return db.query(
        `SELECT * FROM items WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '24 hours'`
    );
};

module.exports.checkSearches = function (description) {
    return db.query(
        `SELECT user_id, search FROM saved_searches
        WHERE search ILIKE $1 
        OR search ILIKE $2 
        OR search ILIKE $3
        OR search ILIKE $4`,
        [
            description + "%",
            "%" + description,
            "%" + description + "%",
            description,
        ]
    );
};

module.exports.addNotificationSearch = function (userId, search, itemId) {
    return db.query(
        `INSERT INTO notifications_search (user_id, search, item_id)
        VALUES ($1, $2, $3)
        RETURNING user_id, search`,
        [userId, search, itemId]
    );
};

module.exports.getNotificationNumSearch = function (userId) {
    return db.query(
        `SELECT COUNT (*) FROM notifications_search 
        WHERE user_id=$1`,
        [userId]
    );
};

module.exports.selectNotificationsSearch = function (userId) {
    return db.query(
        `SELECT search FROM notifications_search WHERE user_id=$1`,
        [userId]
    );
};

module.exports.resetNotificationsSearch = function (userId) {
    return db.query(`DELETE FROM notifications_search WHERE user_id=$1`, [
        userId,
    ]);
};

module.exports.getAllComments = function (id) {
    return db.query(
        `SELECT comments.comment, comments.created_at, users.first, users.last, users.profile_pic FROM comments
        JOIN users
        ON comments.sender_id = users.id
        WHERE item_id = $1
        `,
        [id]
    );
};

module.exports.addComment = function (sender_id, comment, item_id) {
    return db.query(
        `INSERT INTO comments (sender_id, comment, item_id)
        VALUES ($1, $2, $3)`,
        [sender_id, comment, item_id]
    );
};

module.exports.checkFav = function (itemId) {
    return db.query(
        `SELECT user_id FROM favorites
        WHERE item_id = $1`,
        [itemId]
    );
};

module.exports.addNotificationFav = function (userId, itemId) {
    return db.query(
        `INSERT INTO notifications_fav (user_id, item_id)
        VALUES ($1, $2)
        RETURNING user_id, item_id`,
        [userId, itemId]
    );
};

module.exports.getNotificationNumFav = function (userId) {
    return db.query(
        `SELECT COUNT (*) FROM notifications_fav 
        WHERE user_id=$1`,
        [userId]
    );
};

module.exports.selectNotificationsFav = function (userId) {
    return db.query(`SELECT item_id FROM notifications_fav WHERE user_id=$1`, [
        userId,
    ]);
};

module.exports.resetNotificationsFav = function (userId) {
    return db.query(`DELETE FROM notifications_fav WHERE user_id=$1`, [userId]);
};

//things I probably dont need

module.exports.getAllInfo = function (id) {
    let q = `SELECT id, first, last, profile_pic, bio FROM users
            WHERE id = $1`;
    let params = [id];
    return db.query(q, params);
};

module.exports.addImage = function (url, id) {
    let q = `UPDATE users
            SET profile_pic=$1
            WHERE id=$2
            RETURNING profile_pic`;
    let params = [url, id];
    return db.query(q, params);
};

module.exports.addBio = function (bio, id) {
    let q = `UPDATE users
            SET bio=$1
            WHERE id=$2
            RETURNING bio`;
    let params = [bio, id];
    return db.query(q, params);
};

module.exports.getOtherUser = function (id) {
    let q = `SELECT first, last, profile_pic, bio
            FROM users
            WHERE id=$1`;
    let params = [id];
    return db.query(q, params);
};

module.exports.getLastUsers = function () {
    let q = `SELECT * FROM users
            ORDER BY created_at DESC
            LIMIT 3`;
    return db.query(q);
};

/* module.exports.getSearch = function (search) {
    let q = `SELECT * FROM users
            WHERE first
            ILIKE $1
            OR last
            ILIKE $1`;
    let params = [search + "%"];
    return db.query(q, params);
}; */

module.exports.checkFriendship = function (otherId, myId) {
    let q = `SELECT * FROM friendships
            WHERE (recipient_id = $1 AND sender_id = $2)
            OR (recipient_id = $2 AND sender_id = $1)`;
    let params = [otherId, myId];
    return db.query(q, params);
};

module.exports.addRequest = function (sender_id, recipient_id) {
    return db.query(
        `INSERT INTO friendships(sender_id, recipient_id) VALUES ($1, $2)`,
        [sender_id, recipient_id]
    );
};

module.exports.deleteRequest = function (id1, id2) {
    return db.query(
        `DELETE FROM friendships  WHERE (recipient_id = $1 AND sender_id = $2)
            OR (recipient_id = $2 AND sender_id = $1)`,
        [id1, id2]
    );
};

module.exports.acceptRequest = function (sender_id, recipient_id) {
    return db.query(
        `UPDATE friendships SET accepted= 'true' WHERE sender_id=$1 AND recipient_id=$2`,
        [sender_id, recipient_id]
    );
};

module.exports.getFriendsWannabes = function (id) {
    return db.query(
        `SELECT users.id, first, last, profile_pic, accepted
      FROM friendships
      JOIN users
      ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
      OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
      OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`,
        [id]
    );
};

module.exports.getLastTen = function () {
    return db.query(
        `SELECT chat_messages.message, chat_messages.created_at, chat_messages.sender_id AS id, users.first, users.last, users.profile_pic FROM chat_messages LEFT JOIN users ON chat_messages.sender_id=users.id
        ORDER BY chat_messages.created_at DESC
        LIMIT 10`
    );
};

module.exports.addMessage = function (message, sender_id) {
    return db.query(
        `INSERT INTO chat_messages (message, sender_id)
        VALUES ($1, $2)`,
        [message, sender_id]
    );
};

module.exports.getLastMessage = function (id) {
    return db.query(
        `SELECT chat_messages.message, chat_messages.created_at, chat_messages.sender_id AS id, users.first, users.last, users.profile_pic FROM chat_messages LEFT JOIN users ON chat_messages.sender_id=users.id
        WHERE sender_id=$1
        ORDER BY chat_messages.created_at DESC
        LIMIT 1`,
        [id]
    );
};

module.exports.getRequestNum = function (id) {
    return db.query(
        `SELECT COUNT(*)
        FROM friendships
        WHERE recipient_id=$1
        AND accepted=false`,
        [id]
    );
};

module.exports.isItFav = function (userId, itemId) {
    return db.query(
        `SELECT * FROM favorites
        WHERE user_id=$1
        AND item_id=$2`,
        [userId, itemId]
    );
};

module.exports.makeItFav = function (userId, itemId) {
    return db.query(
        `INSERT INTO favorites (user_id, item_id)
        VALUES ($1, $2)`,
        [userId, itemId]
    );
};

module.exports.deleteFav = function (userId, itemId) {
    return db.query(
        `DELETE FROM favorites
        WHERE (user_id=$1)
        AND (item_id=$2)`,
        [userId, itemId]
    );
};

module.exports.getFavs = function (userId) {
    return db.query(
        `SELECT * FROM favorites JOIN items ON favorites.item_id=items.id
        WHERE favorites.user_id=$1`,
        [userId]
    );
};
// DELETE FROM favorites WHERE user_id=1 AND item_id=5;
//INSERT INTO posts (sender_id, post, wall_id) VALUES (68, 'you are great', 108);
