var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:alessandra:postgres@localhost:5432/caper-socialnetwork"
);

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
    let q = `SELECT first, last, profile_pic, bio FROM users
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
