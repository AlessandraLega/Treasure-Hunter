var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:alessandra:postgres@localhost:5432/caper-socialnetwork"
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

module.exports.getSearch = function (search) {
    let q = `SELECT * FROM users
            WHERE first
            ILIKE $1
            OR last
            ILIKE $1`;
    let params = [search + "%"];
    return db.query(q, params);
};

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

module.exports.getAllPosts = function (id) {
    return db.query(
        `SELECT posts.post, posts.created_at, users.first, users.last, users.profile_pic FROM posts
        JOIN users
        ON posts.sender_id = users.id
        WHERE wall_id = $1
        `,
        [id]
    );
};

module.exports.addPost = function (sender_id, post, wall_id) {
    return db.query(
        `INSERT INTO posts (sender_id, post, wall_id)
        VALUES ($1, $2, $3)`,
        [sender_id, post, wall_id]
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

//INSERT INTO posts (sender_id, post, wall_id) VALUES (68, 'you are great', 108);
