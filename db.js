var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:alessandra:postgres@localhost:5432/caper-petition"
);
