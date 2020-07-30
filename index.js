const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const bc = require("./bc.js");
const db = require("./db.js");

app.use(compression());

app.use(express.static("public"));
app.use(express.json());
app.use(
    cookieSession({
        secret: "learning about react!!",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", (req, res) => {
    if (req.session.id) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    bc.hash(req.body.password)
        .then((hashedPw) => {
            db.addUser(req.body.first, req.body.last, req.body.email, hashedPw)
                .then((results) => {
                    req.session.id = results.rows[0].id;
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("error in db.addUser: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("error in bc.hash: ", err);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    db.getHashedPw(req.body.email)
        .then((results) => {
            bc.compare(req.body.password, results.rows[0].password)
                .then((boolean) => {
                    if (boolean) {
                        req.session.id = results.rows[0].id;
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch((err) => {
                    console.log("error in bc.compare: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("error in db.getHashedPassword: ", err);
            res.json({ success: false });
        });
});

app.get("*", function (req, res) {
    if (!req.session.id) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
