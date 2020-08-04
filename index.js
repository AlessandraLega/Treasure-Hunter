const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const bc = require("./bc.js");
const db = require("./db.js");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3.js");
const { s3Url } = require("./config.json");

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

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

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
            req.session.id = results.rows[0].id;
            bc.compare(req.body.password, results.rows[0].password)
                .then((boolean) => {
                    if (boolean) {
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

app.post("/step1", (req, res) => {
    req.session.email = req.body.email;
    db.checkIfUserExists(req.body.email)
        .then((results) => {
            if (results.rows[0]) {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                console.log("secretCode :", secretCode);
                db.addCode(req.body.email, secretCode)
                    .then(() => {
                        let text = `Here is your code ${secretCode}, go back to the website and reset your password!`;
                        sendEmail(req.body.email, text, "Reset Password");
                        res.json({
                            success: true,
                        });
                    })
                    .catch((err) => {
                        console.log("error in addCode: ", err);
                        res.json({ success: false });
                    });
            } else {
                console.log("didnt work");
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("error in check: ", err);
            res.json({ success: false });
        });
});

app.post("/step2", (req, res) => {
    db.checkCode(req.session.email)
        .then((results) => {
            console.log("results.rows[0].code :", results.rows[0].code);
            console.log("req.body.code :", req.body.code);
            if (results.rows[0].code == req.body.code) {
                bc.hash(req.body.newPassword).then((hashedPw) => {
                    db.changePassword(req.session.email, hashedPw)
                        .then(() => {
                            res.json({ success: true });
                        })
                        .catch((err) => {
                            console.log("error in changePassword: ", err);
                            res.json({ success: false });
                        });
                });
            } else {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("error in checkCode: ", err);
            res.json({ success: false });
        });
});

app.get("/user", (req, res) => {
    db.getAllInfo(req.session.id)
        .then((results) => {
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in getAllInfo: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("req.file from index.js post/upload: ", req.file);
    // console.log("req.body from index.js post/upload: ", req.body);
    const { filename } = req.file;
    const url = s3Url + filename;

    // if (req.file) {
    //     res.json({
    //         success: true,
    //     });
    // } else {
    //     res.json({
    //         success: false,
    //     });
    // }

    db.addImage(url, req.session.id)
        .then((results) => {
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in addImage: ", err);
        });
});

app.post("/bio", (req, res) => {
    db.addBio(req.body.bio, req.session.id)
        .then((results) => {
            console.log("results.rows[0] :", results.rows[0]);
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in addBio: ", err);
        });
});

app.get("/other-user/:id", (req, res) => {
    const id = req.params.id;
    console.log("req.params: ", req.params);
    console.log("bin ich da??");
    db.getOtherUser(id)
        .then((results) => {
            console.log(results.rows[0]);
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("err in getOtherUser: ", err);
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
