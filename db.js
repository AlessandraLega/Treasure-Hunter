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
